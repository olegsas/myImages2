
const mongoose = require('mongoose');
const dbURI = require('../config/server-config').mongoUri;
mongoose.Promise = global.Promise
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});

require('./users');
require('./images');