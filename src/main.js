const dotenv = require('dotenv-safe')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const router = require('./router')
const Task = require('./models/Task')

const app = express()

dotenv.load()

const server = {
  port: process.env.PORT || 3000
}

const db = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME
}

mongoose.Promise = Promise
mongoose.connect(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}`, {  useNewUrlParser: true }).then(res => {
  console.log('Successfully connected')
}).catch(err => {
  console.error(err.message)
  process.exit()
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(cors())

router(app)

app.listen(server.port)

console.log(`App started on http://localhost:${server.port}`)
