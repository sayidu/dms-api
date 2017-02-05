const userController = require('../controllers').User;

module.exports = (app) => {
  app.get('/users', userController.showUsers);

  app.get('/users/:id', userController.findaUser);

  app.post('/users', userController.create);

  app.delete('/users/:id', userController.delete);

  app.put('/users/:id', userController.update);

  app.post('/users/login', userController.login);

  app.post('/users/logout', userController.logout);
};