const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mail");

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { email: user.email },
        process.env.TOKEN_SECRET_KEY
      );

      const FRONTEND_URL = process.env.FRONTEND_URL;
      
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Password",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>Reset Password</title>
            <style>
              table, td, div, h1, p { font-family: Arial, sans-serif; }
            </style>
          </head>
          <body style="margin: 0; padding: 0">
            <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffffff;">
              <tr>
                <td align="center" style="padding: 0">
                  <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; border-spacing: 0; text-align: left;">
                    <tr>
                      <td align="center" style="padding: 40px 0 30px 0; background: #f0f3fd">
                        <!-- Logo or title here -->
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 36px 30px 42px 30px;">
                        <p>To reset your password, please click the link below:</p>
                        <a href="${FRONTEND_URL}/reset-password/${user._id}?token=${token}">Reset Password</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      };
      
      await transporter.sendMail(mailOptions);
      res.status(200).send({
        message: "Password reset email sent successfully.",
        data: token,
        error: false,
        success: true,
      });
    } else {
      res.status(404).send({
        message: "This email does not have an account. Please Sign Up.",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Failed to send reset password email.",
      errmsg: error.message,
      error: true,
      success: false,
    });
  }
};

module.exports = forgotPasswordController;
