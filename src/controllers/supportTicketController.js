const SupportTicket = require('../models/supportTicketModel')

const {
  successResponse,
  errorResponse
} = require('../utility/response')

exports.createSupportTicket = async (req, res) => {
  try {
    const { subject, message } = req.body

    const supportTicket = new SupportTicket({
      user: req.user._id,
      subject,
      message
    })

    await supportTicket.save()

    return successResponse(res, supportTicket)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

exports.getSupportTickets = async (req, res) => {
  try {
    const supportTickets = await SupportTicket.find().sort({
      createdAt: -1
    })

    return successResponse(res, supportTickets)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}
