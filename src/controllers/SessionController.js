const mongoose = require('mongoose')
const Session = mongoose.model('Session')

module.exports.index = (req, res) => {
  Session.find({ userId: req.user._id }).exec((err, sessions) => {
    if (err)
      return res.status(400).send(err)
    return res.json(sessions)
  })
}

module.exports.removeAllSessionsExceptCurrent = (req, res) => {
  const criteria = {
    userId: req.user._id,
    token: {
      $ne: req.headers.authorization.split(' ')[1]
    }
  }

  Session.remove(criteria).exec(() => {
    return res.json({ message: 'SessionsSuccessfullyDeleted' })
  })
}

module.exports.destroy = (req, res) => {
  res.locals.session.remove(() => {
    return res.json({ message: 'SessionSuccessfullyDeleted'})
  })
}
