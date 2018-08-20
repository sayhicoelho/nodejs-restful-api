const moment = require('moment')
const jwt = require('jwt-simple')
const User = require('../models/User')
const Task = require('../models/Task')
const Session = require('../models/Session')
const AuthController = require('../controllers/AuthController')
const AccountController = require('../controllers/AccountController')
const TaskController = require('../controllers/TaskController')
const UserController = require('../controllers/UserController')
const SessionController = require('../controllers/SessionController')

function ensureAuthenticated (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'TokenMissing' })
  }

  let payload = null
  const token = req.headers.authorization.split(' ')[1]

  try {
    payload = jwt.decode(token, process.env.JWT_SECRET)
  }
  catch (err) {
    return res.status(401).json({ error: 'TokenInvalid' })
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).json({ error: 'TokenExpired' })
  }

  Session.findOne({ token }, (err, session) => {
    if (err || !session)
      return res.status(401).json({ error: 'TokenInvalid' })

    const query = User.findById(payload.sub).select('+password')

    query.exec((err, user) => {
      if (err || !user)
        return res.status(404).json({ error: 'UserNotFound' })

      req.user = user

      return next()
    })
  })
}

function ensureGuest (req, res, next) {
  if (req.headers.authorization) {
    return res.status(401).json({ error: 'AlreadyLoggedIn' })
  }

  return next()
}

function ensureHasRole (role) {
  return function (req, res, next) {
    if (!req.user.roles.includes(role)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    return next()
  }
}

function ensureOwns (model) {
  return function (req, res, next) {
    const query = model.findOne({ _id: req.params.id, userId: req.user._id })

    query.exec((err, data) => {
      if (err)
        return res.status(400).send(err)

      if (!data)
        return res.status(404).json({ error: `${model.modelName}NotFound` })

      res.locals[model.modelName.toLowerCase()] = data

      return next()
    })
  }
}

module.exports = app => {
  app.use('/tasks', ensureAuthenticated)
  app.route('/tasks')
    .get(TaskController.index)
    .post(TaskController.store)

  app.use('/tasks/:id', ensureOwns(Task))
  app.route('/tasks/:id')
    .get(TaskController.show)
    .put(TaskController.update)
    .delete(TaskController.destroy)

  app.post('/login', ensureGuest, AuthController.login)
  app.post('/register', ensureGuest, AuthController.register)
  app.post('/confirm', ensureGuest, AuthController.confirmAccount)
  app.post('/password/forgot', ensureGuest, AuthController.sendPasswordResetLink)
  app.post('/password/reset', ensureGuest, AuthController.resetPassword)
  app.delete('/logout', ensureAuthenticated, AuthController.logout)

  app.use('/account', ensureAuthenticated)
  app.route('/account')
    .put(AccountController.update)
    .delete(AccountController.destroy)

  app.put('/account/password', AccountController.changePassword)

  app.route('/account/sessions')
    .get(SessionController.index)
    .delete(SessionController.removeAllSessionsExceptCurrent)

  app.delete('/account/sessions/:id', ensureOwns(Session), SessionController.destroy)

  app.use('/users', [ensureAuthenticated, ensureHasRole('admin')])
  app.route('/users')
    .get(UserController.index)

  app.route('/users/:id')
    .get(UserController.show)
    .put(UserController.update)
    .delete(UserController.destroy)
}
