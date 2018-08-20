const nodemailer = require('nodemailer')

const host = process.env.MAIL_HOST
const port = process.env.MAIL_PORT
const secure = process.env.MAIL_SECURE == 'true' ? true : false

const auth = {
  user: process.env.MAIL_USERNAME,
  pass: process.env.MAIL_PASSWORD
}

const tls = {
  rejectUnauthorized: process.env.MAIL_REJECT_UNAUTHORIZED,
  ciphers: process.env.MAIL_CIPHERS
}

module.exports = nodemailer.createTransport({ host, port, auth, secure, tls })
