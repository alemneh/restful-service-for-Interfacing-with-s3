'use strict';
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/s3-assignment');
let db = {};

require('./user')(mongoose, db);
require('./file')(mongoose, db);

module.exports = db;
