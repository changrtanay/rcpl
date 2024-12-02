const cartModel = require("../models/cartModel");

const addToCartController = async (req, res) => {
  try {
    const { productId } = req?.body;
    const { selectedColor } = req?.body;
    const { selectedSize } = req?.body;

    const userId = req.userId;

    const isProductInCart = await cartModel.findOne({
      productId,
      userId,
      size: selectedSize,    // Check for the same size
      color: selectedColor,   // Check for the same color
    });

    if (isProductInCart) {
      return res.json({
        message: "Increase quantity or \n Remove product in Cart.",
        success: false,
        error: true,
      });
    }

    const payload = {
      productId: productId,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      userId: userId,
    };

    const newAddToCart = new cartModel(payload);
    const saveProduct = await newAddToCart.save();

    return res.json({
      message: "Product Added to Cart",
      data: saveProduct,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err?.message,
      error: true,
      success: false,
    });
  }
};

module.exports = addToCartController;
