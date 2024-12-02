const cartModel = require("../models/cartModel");

const cartProductsController = async (req, res) => {
  try {
    const userId = req.userId;

    const cartProducts = await cartModel
      .find({
        userId: userId,
      })
      .populate("productId");

    res.json({
      message: "Cart Products",
      data: cartProducts,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};

module.exports = cartProductsController;
