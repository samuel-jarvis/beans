const mongoose = require('mongoose')

const investmentSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    plan: {
      type: String,
      required: true
    },
    profit: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Investment', investmentSchema)