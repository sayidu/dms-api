import auth from '../middleware/auth';
import docCheck from '../middleware/user';
const userController = require('../controllers').User;
const docController = require('../controllers').Document;
const roleController = require('../controllers').Role;

module.exports = (app) => {
  app.get('/users', auth.isAuthenticated, auth.isAdmin, userController.showUsers);

  app.get('/users/:id', auth.isAuthenticated, userController.findaUser);

  app.post('/users', userController.create);

  app.delete('/users/:id', auth.isAuthenticated, userController.delete);

  app.put('/users/:id', auth.isAuthenticated, userController.update);

  app.post('/users/login', userController.login);

  app.post('/users/logout', auth.isAuthenticated, userController.logout);

  app.post('/documents', auth.isAuthenticated, docCheck.docExists, docController.create);

  app.get('/documents', auth.isAuthenticated, docController.getAllDocs);

  app.get('/search', auth.isAuthenticated, docController.searchDocs);

  app.get('/documents/:id', auth.isAuthenticated, docController.getADoc);

  app.put('/documents/:id', auth.isAuthenticated, docController.updateADoc);

  app.delete('/documents/:id', auth.isAuthenticated, docController.deleteADoc);

  app.get('/users/:id/documents', auth.isAuthenticated, docController.showMyDocs);

  app.post('/roles', auth.isAuthenticated, auth.isAdmin, roleController.create);

  app.get('/roles', auth.isAuthenticated, auth.isAdmin, roleController.all);

  app.put('/roles/:id', auth.isAuthenticated, auth.isAdmin, roleController.update);

  app.delete('/roles/:id', auth.isAuthenticated, auth.isAdmin, roleController.delete);
};
