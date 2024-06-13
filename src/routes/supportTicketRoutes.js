const express = require('express')
const router = express.Router()

const {
  createSupportTicket,
  getSupportTickets
} = require('../controllers/supportTicketController')

const { isAuth } = require('../middleware/authMiddleware')

router.post('/', isAuth, createSupportTicket)

router.get('/', isAuth, getSupportTickets)

module.exports = router
