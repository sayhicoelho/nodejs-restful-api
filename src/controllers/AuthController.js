const mongoose = require('mongoose')
const moment = require('moment')
const utils = require('../utils')
const transporter = require('../utils/mail')
const User = mongoose.model('User')
const Session = mongoose.model('Session')
const AccountConfirmation = mongoose.model('AccountConfirmation')
const PasswordReset = mongoose.model('PasswordReset')

module.exports.login = (req, res) => {
  const criteria = { email: req.body.email }
  const query = User.findOne(criteria).select('+password')

  query.exec((err, user) => {
    if (err || !user)
      return res.status(401).json({ error: 'WrongPassword' })

    if (!user.confirmed)
      return res.status(401).json({ error: 'AccountNotConfirmed' })

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.status(401).json({ error: 'WrongPassword' })

      const userId = user._id
      const token = utils.genToken(user)
      const userAgent = req.get('User-Agent')
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

      let session = new Session({ userId, token, userAgent, ip })

      session.save(() => {
        return res.json({ token })
      })
    })
  })
}

module.exports.logout = (req, res) => {
  const token = req.headers.authorization.split(' ')[1]

  Session.remove({ token }, () => {
    return res.json({ message: 'Logout' })
  })
}

module.exports.register = (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })

  user.save((err, user) => {
    if (err)
      return res.status(400).send(err)

    const token = utils.strRandom()
    const userId = user._id

    let accountConfirmation = new AccountConfirmation({ token, userId })

    accountConfirmation.save(() => {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: 'Almost there!',
        html: `Please <strong><a href="${req.protocol}://${req.hostname}/confirm/${token}">click here</a></strong> to confirm your account.`
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if (err)
          return res.status(500).send(err)

        return res.json({ message: 'TokenSent' })
      })
    })
  })
}

module.exports.confirmAccount = (req, res) => {
  const criteria = { token: req.body.token }
  const query = AccountConfirmation.findOne(criteria).populate('user')

  query.exec((err, accountConfirmation) => {
    if (err)
      return res.status(400).send(err)

    if (!accountConfirmation)
      return res.status(400).json({ error: 'TokenInvalid' })

    const user = accountConfirmation.user

    if (!user)
      return res.status(400).json({ error: 'TokenInvalid' })

    user.confirmed = true

    user.save(() => {
      accountConfirmation.remove(() => {
        const userId = user._id
        const token = utils.genToken(user)
        const userAgent = req.get('User-Agent')
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        let session = new Session({ userId, token, userAgent, ip })

        session.save(() => {
          return res.json({ token })
        })
      })
    })
  })
}

module.exports.sendPasswordResetLink = (req, res) => {
  const criteria = { email: req.body.email }
  const query = User.findOne(criteria).populate('passwordReset')

  query.exec((err, user) => {
    if (err)
      return res.status(400).send(err)

    if (!user)
      return res.status(404).json({ error: 'UserNotFound' })

    if (user.passwordReset)
      return res.status(401).json({ error: 'TokenAlreadySent' })

    const token = utils.strRandom()
    const userId = user._id
    const expiresAt = moment().add(15, 'm').unix()

    let passwordReset = new PasswordReset({ token, userId, expiresAt })

    passwordReset.save(() => {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: user.email,
        subject: 'Password recovery',
        html: `Please <strong><a href="${req.protocol}://${req.hostname}/password/reset/${token}">click here</a></strong> to reset your password.`
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if (err)
          return res.status(500).send(err)

        return res.json({ message: 'TokenSent' })
      })
    })
  })
}

module.exports.resetPassword = (req, res) => {
  const criteria = { token: req.body.token }
  const query = PasswordReset.findOne(criteria).populate('user')

  query.exec((err, passwordReset) => {
    if (err)
      return res.status(400).send(err)

    if (!passwordReset)
      return res.status(400).json({ error: 'TokenInvalid' })

    const user = passwordReset.user

    if (!user || user.email != req.body.email)
      return res.status(400).json({ error: 'TokenInvalid' })

    if (passwordReset.expiresAt <= moment().unix()) {
      passwordReset.remove(() => {
        return res.status(401).json({ error: 'TokenExpired' })
      })
    }
    else {
      user.password = req.body.password

      user.save(() => {
        passwordReset.remove(() => {
          const userId = user._id
          const token = utils.genToken(user)
          const userAgent = req.get('User-Agent')
          const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

          let session = new Session({ userId, token, userAgent, ip })

          session.save(() => {
            return res.json({ token })
          })
        })
      })
    }
  })
}
