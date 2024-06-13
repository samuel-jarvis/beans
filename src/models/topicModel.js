const mongoose = require('mongoose')

const topicSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: false
    },
    category: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
    image: {
      public_id: {
        type: String,
        required: false
      },
      url: {
        type: String,
        required: false
      }
    },
    video: {
      type: String,
      required: false
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

module.exports = mongoose.model('Topic', topicSchema)
