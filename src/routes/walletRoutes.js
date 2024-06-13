const express = require('express')
const router = express.Router()

const { getUserWallet } = require('../controllers/walletController')

const { isAuth } = require('../middleware/authMiddleware')

router.get('/', isAuth, getUserWallet)

module.exports = router
