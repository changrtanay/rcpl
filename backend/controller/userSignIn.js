const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

let userSignInController = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Please provide email.");
    }
    if (!password) {
      throw new Error("Please provide password.");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Email does not exist");
    }

    const getPassword = await bcrypt.compare(password, user.password);

    if (getPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
      };

      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8,
      });

      const tokenOption = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      }

      res.cookie("token", token, tokenOption).status(200).json({
        message: "User Signed In.",
        data: token,
        success: true,
        error: false
      });

      
    } else {
      throw new Error("Password/Email is incorrect.");
    }
  } catch (err) {
    res.json({
      message: err.message,
      error: true,
      success: false,
    });
  }
};

module.exports = userSignInController;