const userModel = require("../models/userModel");

let userDetailsController = async function (req, res) {
  try {
    const user = await userModel.findById(req.userId);
    res.status(200).json({
      message: "User Details",
      data: user,
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

module.exports = userDetailsController;
