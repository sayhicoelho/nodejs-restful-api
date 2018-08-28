const dotenv = require('dotenv-safe')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')

dotenv.load()

const models = require('./models')
const router = require('./router')

const app = express()

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

if (app.get('env') === 'production') {
  app.use((req, res, next) => {
    return req.protocol == 'https' ? next() : res.redirect(`https://${req.hostname}${req.url}`)
  })
}

mongoose.Promise = Promise
mongoose.connect(`mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.name}`, { useNewUrlParser: true }).then(res => {
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
