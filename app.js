const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config()
//const user = require('./server/routes');

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger('dev'));


// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use('/users', user);
require('./server/routes')(app);


// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to our Document Management System.',
}));

module.exports = app;