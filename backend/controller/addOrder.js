const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel"); // Assuming you have a cart model to manage user's cart

let addOrderController = async function (req, res) {
  try {
    const { orderData } = req.body;
    const user = await userModel.findOne({ _id: req.userId });
    const payload = {
      ...orderData,
      email: user.email,
    };

    // Reduce quantities for each product in the order
    for (const item of orderData.productDetails) {
      await productModel.updateOne(
        {
          _id: item.productId,
          "quantity.size": item.size,
          "quantity.colors.color": item.color
        },
        {
          $inc: { "quantity.$[sizeElem].colors.$[colorElem].quantity": -item.quantity }
        },
        {
          arrayFilters: [
            { "sizeElem.size": item.size },
            { "colorElem.color": item.color }
          ]
        }
      );
    }

    // Create and save the order
    const addOrder = new orderModel(payload);
    const saveOrder = await addOrder.save();

    // Clear the user's cart after saving the order
    if (saveOrder) {
      await cartModel.deleteMany({ userId: req.userId });
    }

    res.status(200).json({
      message: "Order Placed",
      data: saveOrder,
      error: false,
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};
module.exports = addOrderController;