const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: String,
    brand: String,
    category: String,
    productPhoto: [],
    description: String,
    mrp: Number,
    sellingPrice: Number,
    size: [],
    color: [],
    quantity: [
      {
        size: String, // e.g., 'XS', 'S', 'M', 'L', 'XL'
        colors: [
          {
            color: String, // e.g., 'Red', 'Blue'
            quantity: Number, // Quantity for this size-color combination
          }
        ],
      }
    ],
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
