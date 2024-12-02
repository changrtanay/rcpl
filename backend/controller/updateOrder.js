const updateOrderPermission = require("../helper/permission");
const orderModel = require("../models/orderModel");

const updateOrderController = async function (req, res) {
  try {
    const admin = req.userId;

    // Check if admin is authorized
    if (!updateOrderPermission(admin)) {
      return res.status(403).json({
        message: "Only Admin can update orders",
        error: true,
        success: false,
      });
    }

    // Destructure product details from request body
    const { productId, orderId, status, color, size } = req.body;

    // Update the order using arrayFilters to correctly target the specific product detail
    const updateOrder = await orderModel.updateOne(
      { _id: orderId },
      {
        $set: { 'productDetails.$[elem].status': status },
      },
      {
        arrayFilters: [
          {
            'elem.productId': productId,
            'elem.color': color,
            'elem.size': size,
          },
        ],
      }
    );

    // Success response
    res.status(200).json({
      message: "Order Status Updated",
      data: updateOrder,
      error: false,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

module.exports = updateOrderController;
