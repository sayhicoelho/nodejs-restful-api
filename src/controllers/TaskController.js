const mongoose = require('mongoose')
const Task = mongoose.model('Task')

module.exports.index = (req, res) => {
  Task.find({ userId: req.user._id }).exec((err, tasks) => {
    if (err)
      return res.status(400).send(err)
    return res.json(tasks)
  })
}

module.exports.store = (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    userId: req.user._id
  }

  let task = new Task(data)

  task.save((err, task) => {
    if (err)
      return res.status(400).send(err)
    return res.json(task)
  })
}

module.exports.show = (req, res) => {
  return res.json(res.locals.task)
}

module.exports.update = (req, res) => {
  res.locals.task.name = req.body.name
  res.locals.task.description = req.body.description
  res.locals.task.status = req.body.status

  res.locals.task.save((err, task) => {
    if (err)
      return res.status(400).send(err)
    return res.json(task)
  })
}

module.exports.destroy = (req, res) => {
  res.locals.task.remove(() => {
    return res.json({ message: 'TaskSuccessfullyDeleted'})
  })
}
