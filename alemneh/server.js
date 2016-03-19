'use strict';

let express = require('express');
let app = express();
let db = require('./models');
let bodyParser = require('body-parser');
let usersRouter = express.Router();
let filesRouter = express.Router();

require('./routes/users-routes')(usersRouter, db);

app.use(bodyParser.json());
app.use('/', usersRouter);
app.use('/', filesRouter);

app.listen(3000, () => {
  console.log('Server on port 3000');
});
