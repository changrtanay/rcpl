const addressModel = require("../models/addressModel");

const addressController = async (req, res) => {
  try {
    const userId = req.userId;

    const addressList = await addressModel
      .find({ userId: userId })

    res.json({
      message: "User Addresses",
      data: addressList,
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

module.exports = addressController;
