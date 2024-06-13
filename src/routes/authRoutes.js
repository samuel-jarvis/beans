const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

const {
  register, login, logout,
  initiatePasswordReset, verifyResetPasswordToken,
  resetPassword, isLoggedIn,
  changePassword, requestOtp, verifyOtp
} = authController

const { isAuth } = require('../middleware/authMiddleware')

router.post('/signup', register)

router.post('/signin', login)

router.post('/signout', logout)

router.post('/forgot-password', initiatePasswordReset)

router.get('/verify-token', verifyResetPasswordToken)

router.post('/reset-password', resetPassword)

router.post('/change-password', isAuth, changePassword)

router.post('/request-otp', requestOtp)

router.post('/verify-otp', verifyOtp)

router.get('/is-auth', isLoggedIn)

module.exports = router
