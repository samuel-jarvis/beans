// const  mongoose from 'mongoose';
const mongoose = require('mongoose')

const accountSchema = mongoose.Schema(
  {
    total_balance: {
      type: Number,
      required: false,
      default: 0
    },
    pending_deposit: {
      type: Number,
      required: false,
      default: 0
    },
    btc_equivalent: {
      type: Number,
      required: false,
      default: 0
    },
    total_deposit: {
      type: Number,
      required: false,
      default: 0
    },
    total_trades: {
      type: Number,
      required: false
    },
    total_profit: {
      type: Number,
      required: false
    }
  },
  {
    timestamps: true
  }
)

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false,
      trim: true
    },
    profilePicture: {
      public_id: {
        type: String,
        required: false
      },
      url: {
        type: String,
        required: false
      }
    },
    country: {
      type: String,
      required: false,
      trim: true
    },
    state: {
      type: String,
      required: false,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: false
    },
    verificationStatus: {
      type: String,
      required: false,
      default: 'awaiting',
      enum: ['awaiting', 'pending', 'verified', 'failed']
    },
    verificationFile: {
      idImage: {
        public_id: {
          type: String,
          required: false,
          default: ''
        },
        url: {
          type: String,
          required: false,
          default: ''
        }
      },
      addressImage: {
        public_id: {
          type: String,
          required: false,
          default: ''
        },
        url: {
          type: String,
          required: false,
          default: ''
        }
      }
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false
    },
    account: {
      type: accountSchema,
      required: false,
      default: {
        total_balance: 0,
        pending_deposit: 0,
        btc_equivalent: 0,
        total_deposit: 0,
        total_trades: 0,
        total_profit: 0
      }
    },
    isBlocked: {
      type: Boolean,
      required: false,
      default: false
    },
    otp: {
      type: String,
      required: false
    },
    withdrawalCode: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)

// module.exports = mongoose.model('User', UserSchema) || mongoose.models.User;
module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
