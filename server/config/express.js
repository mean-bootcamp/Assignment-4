var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes'),
    getCoordinates = require('../controllers/coordinates.server.controller.js');

module.exports.init = function() {
  //connect to database
  mongoose.connect(config.db.uri);

  //initialize app
  var app = express();

  //enable request logging for development debugging
  app.use(morgan('dev'));

  //body parsing middleware
  app.use(bodyParser.json());

  /* server wrapper around Google Maps API to get latitude + longitude coordinates from address */
  app.post('/api/coordinates', getCoordinates, function(req, res) {
    res.send(req.results);
  });





  /* serve static files */
  //See the following reference:
  //http://expressjs.com/en/starter/static-files.html
  app.use('/static', express.static('client'));

  /* use the listings router for requests to the api */
  //Requests to the below URI will redirect to listingsRouter
  app.use('/api/listings', listingsRouter);

  /* go to homepage for all routes not specified */
  //See the following reference for app.all
  //http://expressjs.com/en/api.html
  //The handler is executed for requests to any not specified
  //(ie., “/*”) whether
  // using GET, POST, PUT, DELETE, or any other HTTP request method.
  app.all('/*', function(request, response, next) {
    response.redirect('../index.html');});

  return app;
};
