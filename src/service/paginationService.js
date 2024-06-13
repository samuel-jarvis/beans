const Transaction = require('../models/transactionModel')
const Topic = require('../models/TopicModel')

// pagination function
exports.paginate = async (Model, page = 1, limit = 10, query) => {
  try {
    const startIndex = (page - 1) * limit

    const totalDocuments = await Model.countDocuments().exec()
    const totalPages = Math.ceil(totalDocuments / limit)

    if (page < 1 || page > totalPages) {
      return {
        status: 'fail',
        message: 'Invalid page number'
      }
    }

    const results = await Model.find(query).limit(limit).skip(startIndex).exec()

    return {
      status: 'success',
      data: {
        results,
        page,
        totalPages,
        totalDocuments
      }
    }
  } catch (error) {
    console.log(error)
  }
}
