const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jarvisdev2077@gmail.com",
    pass: "your-email-password",
  },
  port: 587,
  secure: false,
  host: "smtp.gmail.com",
});

module.exports = transporter;
