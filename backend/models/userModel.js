const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    profilePhoto: String,
    role: String,
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
