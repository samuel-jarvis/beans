const Investment = require('../models/investmentModel')

const {
  successResponse,
  errorResponse
} = require('../utility/response')

// create investment for user

exports.createInvestment = async (req, res) => {
  try {
    const { amount, plan, date, status, userId, profit } = req.body

    const investment = new Investment({
      amount,
      plan,
      date,
      status,
      profit,
      user: userId
    })

    await investment.save()
    return successResponse(res, investment)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// get all investments
// @ route : GET /api/investments
// @ access : private

// get all investment with filter for email in query
exports.getInvestments = async (req, res) => {
  try {
    const email = req.query.email

    let investments
    if (email) {
      investments = await
      Investment.find({ user: req.user._id, email }).sort({ createdAt: -1 })
    } else {
      investments = await Investment.find({ user: req.user._id }).sort({ createdAt: -1 })
    }
    return successResponse(res, investments)
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

// delete investment
// @ route : DELETE /api/investments/:id
// @ access : private

exports.deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id)
    if (!investment) {
      return errorResponse(res, 'Investment not found', 404)
    }
    await investment.remove()
    return successResponse(res, 'Investment deleted successfully')
  } catch (error) {
    return errorResponse(res, error.message)
  }
}
