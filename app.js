const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');


const app = express();

// Log requests to the console.
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./server/routes')(app);


app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to our Document Management System.',
}));


module.exports = app;
