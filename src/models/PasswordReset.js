const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PasswordResetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true
  },
  token: {
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Number,
    required: true
  }
})

PasswordResetSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('PasswordReset', PasswordResetSchema)
