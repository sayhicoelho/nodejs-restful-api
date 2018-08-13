const mongoose = require('mongoose')
const Task = mongoose.model('Task')

module.exports.index = (req, res) => {
  Task.find({}, (err, data) => {
    if (err)
      res.send(err)
    res.json(data)
  })
}

module.exports.store = (req, res) => {
  let task = new Task(req.body)

  task.save((err, data) => {
    if (err)
      res.send(err)
    res.json(data)
  })
}

module.exports.show = (req, res) => {
  Task.findById(req.params.id, (err, data) => {
    if (err)
      res.send(err)
    res.json(data)
  })
}

module.exports.update = (req, res) => {
  Task.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, data) => {
    if (err)
      res.send(err)
    res.json(data)
  })
}

module.exports.destroy = (req, res) => {
  Task.remove({ _id: req.params.id }, (err, data) => {
    if (err)
      res.send(err)
    res.json({ message: 'Task successfully deleted.'})
  })
}
