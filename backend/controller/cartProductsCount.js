const cartModel = require("../models/cartModel");

const cartProductsCountController = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch all cart products for the specified user
    const cartProducts = await cartModel.find({ userId: userId });

    // Calculate the total quantity
    const count = cartProducts.reduce((total, e) => total + e.quantity, 0);

    res.json({
      message: "No. of Products in Cart",
      data: {
        count: count,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

module.exports = cartProductsCountController;
