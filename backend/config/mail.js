const nodemailer = require("nodemailer");
const smtpConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

module.exports = transporter;
