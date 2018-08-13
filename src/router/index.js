module.exports = app => {
  const TaskController = require('../controllers/TaskController')

  app.route('/tasks')
    .get(TaskController.index)
    .post(TaskController.store)

  app.route('/tasks/:id')
    .get(TaskController.show)
    .put(TaskController.update)
    .delete(TaskController.destroy)
}
