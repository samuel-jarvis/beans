const mongoose = require('mongoose')

const emailListSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('EmailList', emailListSchema)
