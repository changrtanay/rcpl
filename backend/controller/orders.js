const orderModel = require("../models/orderModel");

const orderController = async (req, res) => {
  try {
    const userId = req.userId;

    const orderList = await orderModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });

    res.json({
      message: "User Orders",
      data: orderList,
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

module.exports = orderController;
