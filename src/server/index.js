const express = require('express'); // express()
const app = express(); // use, post, delete, get, delete, listen
const routes = require('./routes.js');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(routes);

module.exports.app = app;