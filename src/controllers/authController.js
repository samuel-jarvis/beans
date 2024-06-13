const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sendEmail } = require('../service/emailService')
const crypto = require('crypto')

const {
  registerValidation,
  loginValidation
} = require('../validation/validation')
// const { generateOTP } = require('../utility/otpUtility')
const Token = require('../models/tokenModel')
const { removePassword } = require('../utility/core')

const generateRandom17Digits = () => {
  const randomDigits = Math.floor(Math.random() * 9000000000000000) + 1000000000000000

  return `40${randomDigits.toString().padStart(16, '0')}`
}

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

// function to generate set otp for user

const setAndSendOtp = async (user) => {
  try {
    const otp = generateOTP()

    await User.findOneAndUpdate(
      { _id: user._id },
      { otp },
      { new: true }
    )

    const message = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email OTP</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
        <p style="color: #555;">Use the following OTP to complete your action:</p>
        <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; text-align: center; font-size: 24px; margin-bottom: 20px;">
          <strong style="color: #333;">${otp}</strong> <!-- Replace 123456 with your actual OTP -->
        </div>
        <p style="color: #555;">This OTP is valid for a single use and expires after a certain period of time.</p>
        <p style="color: #555;">If you did not request this OTP, please ignore this email.</p>
        <p style="color: #555;">Best regards,<br>Your Company Name</p>
      </div>
    </body>
    </html>`

    await sendEmail({
      to: user.email,
      subject: 'OTP',
      text: message
    })
  } catch {
    console.log('Error setting otp')
  }
}

// Register
exports.register = async (req, res) => {
  console.log(req.body, 'req.body')
  // Validate data before creating a user
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const emailExists = await User.findOne({ email: req.body.email })
  if (emailExists) return res.status(400).send('Email already exists')

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
    country: req.body.country || ''
  })

  try {
    const newUser = await user.save()
    const { password, ...otherDetails } = newUser._doc
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)

    res
      .cookie('suToken', token, {
        maxAge: 50000 * 60 * 24,
        // httpOnly: true,
        sameSite: 'lax'
      // secure: true
      })
      .status(200)
      .json({
        message: 'Logged in successfully',
        token,
        user: otherDetails,
        status: 200
      })
  } catch (err) {
    res.status(400).send(err)
  }
}

// Login
exports.login = async (req, res) => {
  // Validate data before creating a user
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // Check if email exists
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Account not registered')

  // remove password from user object
  const { password, ...otherDetails } = user._doc

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) return res.status(400).send('Incorrect password')

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)

  res
    .cookie('suToken', token, {
      maxAge: 50000 * 60 * 24,
      // httpOnly: true,
      sameSite: 'lax'
      // secure: true
    })
    .status(200)
    .json({
      message: 'Logged in successfully',
      token,
      user: otherDetails,
      status: 200
    })
}

// Logout
exports.logout = async (req, res) => {
  res.clearCookie('suToken')
  res.cookie('suToken', '', { maxAge: '1', expires: new Date(Date.now() - 86400) })
  res.status(200).json({
    message: 'Logged out successfully'
  })
}

// change password with old password and new password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      status: false,
      message: 'Old password and new password are required'
    })
  }

  const user = await User.findOne({ _id: req.user._id })
  if (!user) {
    return res.status(400).json({
      status: false,
      message: 'User does not exist'
    })
  }

  const isValid = await bcrypt.compare(oldPassword, user.password)
  if (!isValid) {
    return res.status(400).json({
      status: false,
      message: 'Invalid old password'
    })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(newPassword, salt)

  try {
    await User.findOneAndUpdate(
      { _id: user._id },
      { password: hash },
      { new: true }
    )

    res.status(200).json({
      status: true,
      message: 'Password changed successfully'
    })
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Password could not be changed'
    })
  }
}

// implement a forgot password route
exports.initiatePasswordReset = async (req, res) => {
  const email = req.body.email

  if (!email) {
    return res.status(400).json({
      status: false,
      message: 'Email is required'
    })
  }

  // check if user exists
  const userExists = await User.findOne({ email })
  if (!userExists) {
    return res.status(400).json({
      status: false,
      message: 'User does not exist'
    })
  }

  console.log(userExists, 'userExists')

  const findToken = await Token.findOne({ user: userExists._id })
  if (findToken) {
    await findToken.deleteOne()
  }

  try {
    const token = crypto.randomBytes(32).toString('hex')
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(token, salt)

    await new Token({
      token: hash,
      user: userExists._id
    }).save()

    console.log('token', token)

    const link = `${process.env.CLIENT_URL}/reset-password?id=${userExists._id}&token=${token}`
    const message = `
      <h1>Hi ${userExists.firstName},</h1>
      <p>Please click on the link below to reset your password</p>
      <a href=${link} clicktracking=off>${link}</a>
    `

    await sendEmail({
      to: email,
      subject: 'Password reset request',
      text: message
    })

    res.status(200).json({
      status: true,
      message: 'Password reset link sent successfully'
    })
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Email could not be sent'
    })
  }
}

// verify reset password token

exports.verifyResetPasswordToken = async (req, res) => {
  const { userId, token } = req.query

  console.log(userId, token)

  if (!userId || !token) {
    return res.status(400).json({
      status: false,
      message: 'Token and userId are required'
    })
  }

  const user = await User.findOne({ _id: userId })
  if (!user) {
    return res.status(400).json({
      status: false,
      message: 'User does not exist'
    })
  }

  const findToken = await Token.findOne({ user: userId })

  if (!findToken) {
    return res.status(400).json({
      status: false,
      message: 'Token not found'
    })
  }

  console.log(findToken.token, 'findToken')
  console.log(token, 'token')

  const isValid = await bcrypt.compare(token, findToken.token)

  if (!isValid) {
    return res.status(400).json({
      status: false,
      message: 'Invalid token'
    })
  }

  res.status(200).json({
    status: true,
    message: 'Token is valid',
    data: {
      email: user.email
    }
  })
}

// reset password

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: 'Email and new password are required'
    })
  }

  // find user by email
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({
      status: false,
      message: 'User does not exist'
    })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  try {
    await User.findOneAndUpdate(
      { _id: user._id },
      { password: hash },
      { new: true }
    )

    res.status(200).json({
      status: true,
      message: 'Password reset successful'
    })
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Password could not be reset'
    })
  }
}

// check if user is logged in
exports.isLoggedIn = async (req, res) => {
  try {
    const token = req.cookies.suToken
    if (!token) return res.status(200).json({ status: false })

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        return res.status(200).json({ status: false })
      } else {
        console.log(decodedToken)
        const user = await User.findById(decodedToken._id)
        const userData = removePassword(user)
        res.status(200).json({ status: true, user: userData })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false })
  }
}

// request for otp
exports.requestOtp = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })

    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'User does not exist'
      })
    }

    await setAndSendOtp(user)

    res.status(200).json({
      status: true,
      message: 'OTP sent successfully'
    })
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'OTP could not be sent'
    })
  }
}

// verify otp
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body

  if (!otp) {
    return res.status(400).json({
      status: false,
      message: 'OTP is required'
    })
  }

  const user = await User.findOne({ _id: req.user._id })

  if (!user) {
    return res.status(400).json({
      status: false,
      message: 'User does not exist'
    })
  }

  if (user.otp !== otp) {
    return res.status(400).json({
      status: false,
      message: 'Invalid OTP'
    })
  }

  res.status(200).json({
    status: true,
    message: 'OTP is valid'
  })
}
