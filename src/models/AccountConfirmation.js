const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountConfirmationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    require: true
  },
  token: {
    type: String,
    require: true
  }
})

AccountConfirmationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model('AccountConfirmation', AccountConfirmationSchema)
