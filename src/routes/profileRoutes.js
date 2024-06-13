const express = require('express')
const router = express.Router()

const {
  getUserByUsername,
  getUserById,
  searchUsers,
} = require('../controllers/profileController')

const { isAuth } = require('../middleware/authMiddleware')

router.get('/:id', getUserById)

router.get('/search/:query', searchUsers)

router.get('/username/:username', isAuth, getUserByUsername)

module.exports = router
