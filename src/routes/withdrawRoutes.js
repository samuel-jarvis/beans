const express = require('express')
const router = express.Router()

const {
  createWithdraw
} = require('../controllers/withdrawController')

const { isAuth, isAdmin } = require('../middleware/authMiddleware')

router.post('/', isAuth, createWithdraw)

module.exports = router
