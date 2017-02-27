'use strict';

const userController = require('../controllers').User;
const docController = require('../controllers').Document;
const roleController = require('../controllers').Role;
const auth = require('../middleware/auth');

module.exports = (app) => {
  app.get('/users', auth.isAuthenticated, auth.isAdmin, userController.showUsers);

  app.get('/users/:id', userController.findaUser);

  app.post('/users', userController.create);

  app.delete('/users/:id', userController.delete);

  app.put('/users/:id', userController.update);

  app.post('/users/login', userController.login);

  app.post('/users/logout',  auth.isAuthenticated, userController.logout);

  app.post('/documents', auth.isAuthenticated, docController.create);

  app.get('/documents', auth.isAuthenticated, docController.getAllDocs);

  app.get('/documents/:id', auth.isAuthenticated, docController.getADoc);

  app.put('/documents/:id', auth.isAuthenticated,  docController.updateADoc);

  app.delete('/documents/:id',  auth.isAuthenticated, docController.deleteADoc);

  app.get('/users/:id/documents',  auth.isAuthenticated, docController.showMyDocs)

  app.get('/roles',auth.isAuthenticated, auth.isAdmin,  roleController.all);

  app.post('/roles', auth.isAuthenticated, auth.isAdmin, roleController.create);
};