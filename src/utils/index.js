const jwt = require('jwt-simple')
const moment = require('moment')

module.exports.genToken = (user) => {
  const payload = {
    sub: user._id,
    user: {
      name: user.name,
      email: user.email,
      roles: user.roles
    },
    iat: moment().unix(),
    exp: moment().add(process.env.JWT_EXP, 'm').unix()
  }

  return jwt.encode(payload, process.env.JWT_SECRET)
}

module.exports.strRandom = (length) => {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  length = length || 60

  let str = ''

  for (let i = 0; i < length; i++) {
    str += charset.charAt(Math.random() * charset.length)
  }

  return str
}
