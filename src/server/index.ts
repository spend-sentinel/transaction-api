const xpress = require('express'); // express()
const app = xpress(); // use, post, delete, get, delete, listen
const routes = require('./routes.ts');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(routes);

module.exports.application = app;