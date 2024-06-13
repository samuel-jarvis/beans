const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 1800
  }
})

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
