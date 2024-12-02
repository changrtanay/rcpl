const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productDetails: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      default: "",
    },

    // shippingAddressId: {
    //   type: String,
    //   default: "",
    // },
    
    shippingAddress: {
      addressId: {
        type: String,
        default: "",
      },
      addressName: {
        type: String,
        default: "",
      },
      addressPhone: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
      pincode: {
        type: String,
        default: "",
      },
    },
    paymentDetails: {
      paymentId: {
        type: String,
        default: "",
      },
      payment_method_type: [],
      payment_status: {
        type: String,
        default: "",
      },
    },
    shipping_options: [],
    totalAmount: {
      type: String,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
