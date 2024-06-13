const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userControllers')

const {
  updateProfile,
  getMe,
  uploadVerificationDocument,
  updateKYC,
  updateProfilePicture,
  transferMoney, getUserByUsername
} = userControllers

const { isAuth, isAdmin } = require('../middleware/authMiddleware')

router.patch('/profile', isAuth, updateProfile)

router.post('/verification', isAuth, uploadVerificationDocument)

router.post('/profile-picture', isAuth, updateProfilePicture)

router.get('/me', isAuth, getMe)

router.post('/transfer', isAuth, transferMoney)

router.get('/username/:username', isAuth, getUserByUsername)

router.post('/kyc', isAuth, updateKYC)

// admin routes

// admin routes
router.get('/admin', isAuth, isAdmin, userControllers.getAllUsers)

router.get('/admin/:id', isAuth, isAdmin, userControllers.getUserById)

router.get('/admin/email/:email', isAuth, userControllers.getUserByEmail)

router.put('/admin/account/:id', isAuth, isAdmin, userControllers.updateUserAccount)

router.put('/admin/:id', isAuth, isAdmin, userControllers.updateUser)

router.delete('/admin/:id', isAuth, isAdmin, userControllers.deleteUser)

module.exports = router
