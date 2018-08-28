const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports.index = (req, res) => {
  User.find({}, (err, users) => {
    if (err)
      return res.status(400).send(err)
    return res.json(users)
  })
}

module.exports.show = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err)
      return res.status(400).send(err)

    if (!user)
      return res.status(404).json({ error: 'UserNotFound' })

    return res.json(user)
  })
}

module.exports.update = (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email
  }

  const options = {
    new: true,
    runValidators: true
  }

  User.findByIdAndUpdate(req.params.id, data, options, (err, user) => {
    if (err)
      return res.status(400).send(err)

    if (!user)
      return res.status(404).json({ error: 'UserNotFound' })

    return res.json(user)
  })
}

module.exports.destroy = (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err)
      return res.status(400).send(err)

    if (!user)
      return res.status(404).json({ error: 'UserNotFound' })

    return res.json({ message: 'UserSuccessfullyDeleted.'})
  })
}
