const addressModel = require("../models/addressModel");
let addAddressController = async function (req, res) {
  try {
    const userId = req.userId;

    const payload = {
      userId: userId,
      ...req.body
    };

    const addAddress = new addressModel(payload)
    const saveAddress = await addAddress.save() 

    res.status(200).json({
      message: "Address Added",
      data: saveAddress,
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

module.exports = addAddressController;
