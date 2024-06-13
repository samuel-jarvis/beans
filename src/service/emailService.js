const nodemailer = require('nodemailer')

exports.sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com',
      port: 587,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    })

    const message = {
      from: 'Fidroth Support',
      to: email,
      subject,
      html
    }

    await transporter.sendMail(message)
  } catch (error) {
    console.log(error)
  }
}
