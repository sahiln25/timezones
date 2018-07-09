const mongoose = require( 'mongoose' );
const config = require('../config');

const dbLoc = config.database;

// Create the database connection
mongoose.Promise = global.Promise;
mongoose.connect(dbLoc);

// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open at  ' + dbLoc);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose connection has been disconnected (app terminated)');
        process.exit(0);
    });
});