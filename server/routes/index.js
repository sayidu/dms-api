const userController = require('../controllers').User;

module.exports = (app) => {
 // app.get('/users', userController.showUsers);

  app.get('/users/:id', userController.findaUser);

  app.post('/users', userController.create);

  app.delete('/users/:id', userController.delete);

  app.put('/users/:id', userController.update);

 /* app.post('/users/login', (req, res) => res.status(200).send({
    message: 'I am a user',
  }));

  app.post('/users/logout', (req, res) => res.status(200).send({
    message: 'I am a user',
  }));

  app.post('/users', (req, res) => res.status(200).send({
    message: 'I am a user',
  }));

  app.get('/users', (req, res) => res.status(200).send({
    message: 'I am a user',
  }));

  app.get('/users/:id', (req, res) => res.status(200).send({
    message: 'I am a user',
  }));

  app.put('/users/:id', (req, res) => res.status(200).send({
    message: 'I am a user',
  }));

  app.delete('/users/:id', (req, res) => res.status(200).send({
    message: 'I am a user',
  }));*/
};