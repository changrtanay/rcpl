const orderModel = require("../models/orderModel");

const allOrdersController = async (req, res) => {
  try {
    const allOrders = await orderModel.find().sort({ createdAt: -1 });

    res.json({
      message: "All Orders",
      data: allOrders,
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

module.exports = allOrdersController;
