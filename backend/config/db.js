const mongoose = require("mongoose");

let connectDb = async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
