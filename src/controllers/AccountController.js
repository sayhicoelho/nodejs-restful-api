module.exports.update = (req, res) => {
  req.user.name = req.body.name

  req.user.save((err, user) => {
    if (err)
      return res.status(400).send(err)
    return res.json({ message: 'AccountUpdated' })
  })
}

module.exports.changePassword = (req, res) => {
  req.user.comparePassword(req.body.currentPassword, (err, isMatch) => {
    if (!isMatch)
      return res.status(401).json({ error: 'WrongCurrentPassword' })

    req.user.password = req.body.password

    req.user.save((err, user) => {
      if (err)
        return res.status(400).send(err)
      return res.json({ message: 'PasswordChanged' })
    })
  })
}

module.exports.destroy = (req, res) => {
  req.user.remove(() => {
    return res.json({ message: 'AccountSuccessfullyDeleted' })
  })
}
