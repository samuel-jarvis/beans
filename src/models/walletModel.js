const mongoose = require('mongoose')

const walletSchema = mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      required: false,
      default: 'USD'
    },
    transactions: {
      type: [String],
      required: false,
      default: []
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

const Wallet = mongoose.model('Wallet', walletSchema)

module.exports = Wallet
