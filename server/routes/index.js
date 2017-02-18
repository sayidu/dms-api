const userController = require('../controllers').User;
const docController = require('../controllers').Document;
const auth = require('../middleware/auth');

module.exports = (app) => {
  app.get('/users', auth.isAuthenticated, userController.showUsers);

  app.get('/users/:id', userController.findaUser);

  app.post('/users', userController.create);

  app.delete('/users/:id', userController.delete);

  app.put('/users/:id', userController.update);

  app.post('/users/login', userController.login);

  app.post('/users/logout', userController.logout);

  app.post('/documents', docController.create);

  app.get('/documents', docController.getDocs);

  app.get('/documents/:id', docController.getADoc);

  app.put('/documents/:id', docController.updateADoc);

  app.delete('/documents/:id', docController.deleteADoc);

  app.get('/users/:id/documents', docController.showMyDocs)
};