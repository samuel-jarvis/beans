const express = require('express')
const router = express.Router()

const {
  getNotifications, addNotification,
  deleteNotification
} = require('../controllers/notificationController')

const { isAuth, isAdmin } = require('../middleware/authMiddleware')

router.get('/', isAuth, getNotifications)

router.post('/', isAuth, isAdmin, addNotification)

router.delete('/:id', isAuth, deleteNotification)

module.exports = router
