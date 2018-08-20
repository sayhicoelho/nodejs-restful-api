const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validate = require('mongoose-validator')
const Schema = mongoose.Schema

const validator = {
  email: [
    validate({
      validator: 'isEmail'
    })
  ]
}

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    minlength: 3,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    validate: validator.email,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  roles: {
    type: [
      {
        type: String,
        enum: ['admin', 'manager', 'editor', 'user']
      }
    ],
    default: ['user']
  }
})

UserSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
})

UserSchema.virtual('sessions', {
  ref: 'Session',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
})

UserSchema.virtual('accountConfirmation', {
  ref: 'AccountConfirmation',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
})

UserSchema.virtual('passwordReset', {
  ref: 'PasswordReset',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
})

UserSchema.pre('save', function (next) {
  let user = this

  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash
    return next()
  })
})

UserSchema.pre('findOneAndUpdate', function (next) {
  let user = this._update

  if (typeof user.password == 'undefined')
    return next()

  bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash
    return next()
  })
})

UserSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
