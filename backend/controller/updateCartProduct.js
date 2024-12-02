const cartModel = require("../models/cartModel");

const updateCartProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req?.body?._id;

    const qty = req.body.quantity;

    const updateProduct = await cartModel.updateOne(
      { _id: productId },
      {
        ...(qty && { quantity: qty }),
      }
    );

    res.json({
      message: "Product Updated",
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err?.message,
      error: true,
      success: false,
    });
  }
};

module.exports = updateCartProduct;
