const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: String,
  name: String,
  phone: Number,
  address: String,
  pincode: Number,
});

const addressModel = mongoose.model("addresses", addressSchema);

module.exports = addressModel;
