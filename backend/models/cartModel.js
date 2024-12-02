const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    productId: {
      ref: "products",
      type: String,
    },
    size: String,
    color: String,
    quantity: Number,
    userId: String,
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;
