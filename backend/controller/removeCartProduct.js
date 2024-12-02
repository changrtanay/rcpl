const cartModel = require("../models/cartModel");

const removeCartProduct = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.body._id;

    const deleteProduct = await cartModel.deleteOne({
      _id: productId,
    });

    res.json({
      message: "Product Removed From Cart",
      data: deleteProduct,
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

module.exports = removeCartProduct;
