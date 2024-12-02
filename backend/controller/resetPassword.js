const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

const resetPasswordController = async (req, res) => {
  const { newPassword, confirmPassword, _id } = req.body;

  try {
    if (newPassword === confirmPassword) {
      const user = await userModel.findById(_id);
      if (!user) {
        return res.json({
          message: "User not found.",
          error: true,
          success: false,
        });
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.json({
          message: "New Password cannot be same as Old Password.",
          error: true,
          success: false,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      const updateUser = await userModel.updateOne(
        { _id: _id },
        { $set: { password: hashPassword } }
      );

      if (updateUser.acknowledged) {
        res.json({
          message: "Password changed.",
          error: false,
          success: true,
        });
      } else {
        res.json({
          message: "Failed to update password.",
          error: true,
          success: false,
        });
      }
    } else {
      res.json({
        message: "Please confirm password correctly.",
        error: true,
        success: false,
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};

module.exports = resetPasswordController;
