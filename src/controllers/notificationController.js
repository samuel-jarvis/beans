const Notification = require('../models/notificationModel')

const {
  successResponse,
  errorResponse
} = require('../utility/response')

// get all notifications
// @ route : GET /api/notifications
// @ access : private

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 })
    return successResponse(res, notifications)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// add notification for user
// @ route : POST /api/notifications
// @ access : private
exports.addNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      user: req.user._id,
      message: req.body.message
    })
    return successResponse(res, notification)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// set notification as isDeleted

// delete notification
// @ route : DELETE /api/notifications/:id
// @ access : private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
    if (!notification) {
      return errorResponse(res, 'Notification not found')
    }
    await notification.remove()
    return successResponse(res, notification)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}
