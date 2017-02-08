const userController = require('../controllers').User;
const docController = require('../controllers').Document;

module.exports = (app) => {
  app.get('/users', userController.showUsers);

  app.get('/users/:id', userController.findaUser);

  app.post('/users', userController.create);

  app.delete('/users/:id', userController.delete);

  app.put('/users/:id', userController.update);

  app.post('/users/login', userController.login);

  app.post('/users/logout', userController.logout);

  app.post('/document', docController.create);

  app.get('/document', docController.getDocs);

  app.get('/document/:id', docController.getADoc);

  app.put('/document/:id', docController.updateADoc);

  app.delete('/document/:id', docController.deleteADoc);

  app.get('/users/:id/documents', docController.showMyDocs)
};