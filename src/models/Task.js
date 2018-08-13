const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
  name: {
    type: String,
    required: 'Task name is required.'
  },
  status: {
    type: [
      {
        type: String,
        enum: ['pending', 'ongoing', 'completed']
      }
    ],
    default: ['pending']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Task', TaskSchema)
