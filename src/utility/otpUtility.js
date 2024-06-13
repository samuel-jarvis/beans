// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

const { transporter } = require("../config/nodemailerConfig");

function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// function to send OTP to the user
async function sendOTP(email, otp) {
  try {
    const data = {
      from: "jarvisdev@gmail.com",
      to: email,
      subject: "OTP for password reset",
      html: `<p>Your OTP for password reset is <b>${otp}</b></p>`,
    };

    transporter.sendMail(data, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
    });
  } catch (error) {
    console.log("Error sending OTP:", error);
  }
}

module.exports = { generateOTP, sendOTP };
