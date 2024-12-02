const userModel = require("../models/userModel");

let updateUserController = async function (req, res) {
  try {
    const admin = req.userId

    const { userId, name, email, role } = req.body;

    const payload = {
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(role && { role: role }),
    };

    const updateUser = await userModel.findByIdAndUpdate(userId, payload);

    res.status(200).json({
      message: "User Updated",
      data: updateUser,
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

module.exports = updateUserController;
