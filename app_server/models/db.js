var mongoose = require('mongoose');

//setting up the connection to mongoDB
var dbURI = 'mongodb://localhost/loc8r';
mongoose.connect(dbURI);

// monitoring the status of the connection.
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

// for nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// for app termination
process.on('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});

// for heroku app termination
process.on('SIGTERM', function () {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
  });
});
