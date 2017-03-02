const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
//require('dotenv').config();
//const user = require('./server/routes');

const app = express();

// Log requests to the console.
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./server/routes')(app);


app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to our Document Management System.',
}));

app.listen(port, function () {
  console.log('Server Up and Running!');
});

module.exports = app;