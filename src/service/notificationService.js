const Notification = require('../models/notificationModel')

const sendNotification = async (user, otherUser, type, message, referenceId = '') => {
  try {
    const notification = new Notification({
      user,
      otherUser: otherUser || null,
      type,
      referenceId,
      message
    })

    await notification.save()
  } catch (error) {
    console.log('Error creating notification:', error.message)
    throw new Error(error.message)
  }
}

module.exports = sendNotification
