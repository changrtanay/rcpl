const addressModel = require("../models/addressModel");

let updateAddressController = async function (req, res) {
  try {

    const { _id, ...body} = req.body

    const updateAddress = await addressModel.findByIdAndUpdate(_id, body)

    res.status(200).json({
      message: "Address Updated",
      data: updateAddress,
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

module.exports = updateAddressController;
