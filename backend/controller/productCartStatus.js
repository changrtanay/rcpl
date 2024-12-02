const cartModel = require("../models/cartModel");

const productCartStatusController = async (req, res) => {
  try {
    const userId = req.userId;
    // Fetch cart products for this user with size and color
    const cartProducts = await cartModel.find({ userId }).select('productId size color');

    return res.json({
      message: "Cart Products",
      data: cartProducts, // Include size and color in the response
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

module.exports = productCartStatusController;
