/* eslint-disable camelcase */
const User = require('../models/userModel')
const Transaction = require('../models/transactionModel')
const mongoose = require('mongoose')
const cloudinaryUpload = require('../config/cloudinaryUpload')

const { successResponse, errorResponse } = require('../utility/response')

const {
  updateProfileValidation
} = require('../validation/validation')
const { removePassword } = require('../utility/core')

// update the user's profile
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) return res.status(400).send('User not found')

  // Update the user's profile
  const updated = await User.findByIdAndUpdate(
    req.user._id,
    {
      // firstName: req.body.firstName,
      // lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
      state: req.body.state
    },
    { new: true }
  )
  const { password, ...otherDetails } = updated._doc

  try {
    return successResponse(res, otherDetails, 'User Profile Updated Successfully')
  } catch (err) {
    console.log('Error: ', err)
    return errorResponse(res, err)
  }
}

// complete onboarding add bio and interest
exports.uploadVerificationDocument = async (req, res) => {
  const userId = req.user._id
  const { passport, documentFront, documentBack, documentType, dateOfBirth } = req.body

  if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(404).send('No user with that id') }

  try {
    const user = await User.findById(userId)

    const uploadPassport = cloudinaryUpload.image(passport)
    const uploadDocumentFront = cloudinaryUpload.image(documentFront)
    const uploadDocumentBack = cloudinaryUpload.image(documentBack)

    const [passportResult, documentFrontResult, documentBackResult] = await Promise.all([uploadPassport, uploadDocumentFront, uploadDocumentBack])

    user.verification = {
      documentFront: {
        public_id: documentFrontResult.public_id,
        url: documentFrontResult.secure_url
      },
      documentBack: {
        public_id: documentBackResult.public_id,
        url: documentBackResult.secure_url
      },
      documentType
    }

    user.dateOfBirth = dateOfBirth

    user.verificationStatus = 'pending'

    user.profilePicture = {
      public_id: passportResult.public_id,
      url: passportResult.secure_url
    }

    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Complete Verification File Upload Successfully',
      data: user
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

// update user profile picture
exports.updateProfilePicture = async (req, res) => {
  const fileStr = req.body.image
  const user = await User.findById(req.user._id)
  if (!user) return res.status(400).send('User not found')

  const profilePicture = user.profilePicture
  if (!profilePicture) return res.status(400).send('profilePicture not found')

  try {
    const result = await cloudinaryUpload.image(fileStr)
    if (!result) return res.status(400).send('Error uploading image')

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePicture: {
          public_id: result.public_id,
          url: result.secure_url
        }
      },
      { new: true }
    )

    const { password, ...otherDetails } = updated._doc
    return res.status(200).json({
      message: 'User Profile Picture Updated Successfully',
      data: otherDetails
    })
  } catch (err) {
    console.log('Error: ', err)
    res.status(400).json(err)
  }
}

// get current logged user profile
exports.getMe = async (req, res) => {
  const user = req.user
  if (!user) return res.status(400).send('User not found')

  const userDetails = removePassword(user)

  try {
    return res.status(200).json({
      message: 'User Profile Fetched Successfully',
      data: userDetails
    })
  } catch (err) {
    console.log('Error: ', err)
    res.status(400).json(err)
  }
}

// endpoint for user to transfer money to another user
exports.transferMoney = async (req, res) => {
  const { amount, username } = req.body

  if (!amount || !username) return res.status(400).send('Amount and username are required')

  const user = await User.findById(req.user._id)
  if (!user) return res.status(400).send('User not found')

  const recipient = await User.findOne({ username })
  if (!recipient) return res.status(400).send('Recipient not found')

  if (amount < 1) return res.status(400).send('Amount must be greater than 0')

  if (user.account.balance < amount) return res.status(400).send('Insufficient funds')

  try {
    user.account.balance -= amount
    recipient.account.balance += amount

    await user.save()
    await recipient.save()

    // add to transaction history
    await Transaction.create({
      user: user._id,
      amount,
      description: `Transfer to ${recipient.firstName} ${recipient.lastName}`,
      transactionType: 'transfer',
      date: new Date()
    })

    await Transaction.create({
      user: recipient._id,
      amount,
      description: `Received from ${user.firstName} ${user.lastName}`,
      transactionType: 'received',
      date: new Date()
    })

    return res.status(200).json({
      message: 'Money Transferred Successfully',
      data: user
    })
  } catch (err) {
    console.log('Error: ', err)
    res.status(400).json(err)
  }
}

// admin endpoint to get all users

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('firstName lastName email phone location')
    return res.status(200).json({
      message: 'Users Fetched Successfully',
      data: users
    })
  } catch (err) {
    console.log('Error: ', err)
    res.status(400).json(err)
  }
}

// get user by id
exports.getUserById = async (req, res) => {
  const userId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(404).send('No user with that id') }

  try {
    const user = await User.findById(userId)
    return res.status(200).json({
      message: 'User Fetched Successfully',
      data: user
    })
  } catch (err) {
    console.log('Error: ', err)
    res.status(400).json(err)
  }
}

// get user by email

exports.getUserByEmail = async (req, res) => {
  const email = req.params.email

  if (!email) { return res.status(400).send('No email provided') }

  console.log('Email: ', email)

  try {
    const user = await User.findOne({ email })
      .select('firstName lastName email')

    console.log('User: ', user)

    return res.status(200).json({
      message: 'User Fetched Successfully',
      data: user
    })
  } catch (err) {
    console.log('Error: ', err)
    res.status(400).json(err)
  }
}

// get user by username

exports.getUserByUsername = async (req, res) => {
  const username = req.params.username

  if (!username) { return res.status(400).send('No username provided') }

  try {
    const user = await User.findOne({ username })

    return res.status(200).json({
      message: 'User Fetched Successfully',
      data: user
    })
  } catch (err) {
    console.log('Error: ', err)
    res.status(400).json(err)
  }
}

// admin update user.account with savings, checkings, number
exports.updateUserAccount = async (req, res) => {
  const userId = req.params.id

  const { total_balance, btc_equivalent, pending_deposit, total_deposit, total_profit, total_trades, withdrawalCode } = req.body

  if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(404).send('No user with that id') }

  try {
    const user = await User.findById(userId)

    user.account = {
      total_balance,
      btc_equivalent,
      pending_deposit,
      total_deposit,
      total_profit,
      total_trades
    }

    if (withdrawalCode) user.withdrawalCode = withdrawalCode

    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'User Account Updated Successfully',
      data: user
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

// update all user info if provided
exports.updateUser = async (req, res) => {
  const body = req.body
  const userId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(404).send('No user with that id') }

  try {
    const user = await User.findByIdAndUpdate(userId, body, { new: true })

    res.status(200).json({
      status: 'success',
      message: 'User Updated Successfully',
      data: user
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.deleteUser = async (req, res) => {
  const userId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(404).send('No user with that id') }

  try {
    await User.findByIdAndDelete(userId)

    res.status(200).json({
      status: 'success',
      message: 'User Deleted Successfully'
    })
  } catch (error) {
    res.status(500).json(error)
  }
}

exports.updateKYC = async (req, res) => {
  const idImage = req.body.idImage
  const addressImage = req.body.addressImage

  const user = await User.findById(req.user._id)
  if (!user) return res.status(400).send('User not found')

  try {
    const [idImageResult, addressImageResult] = await Promise.all([
      cloudinaryUpload.image(idImage),
      cloudinaryUpload.image(addressImage)
    ])

    const verificationFile = {
      idImage: {
        public_id: idImageResult.public_id,
        url: idImageResult.secure_url
      },
      addressImage: {
        public_id: addressImageResult.public_id,
        url: addressImageResult.secure_url
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        verificationFile,
        verificationStatus: 'pending'
      },
      { new: true }
    )

    const { password, ...otherDetails } = updated._doc

    return res.status(200).json({
      message: 'KYC Updated Successfully',
      data: otherDetails
    })
  } catch (err) {
    console.log('Error: ', err)
    res.status(400).json(err)
  }
}
