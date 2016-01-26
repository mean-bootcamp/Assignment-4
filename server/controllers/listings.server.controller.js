
/* Dependencies */
var mongoose = require('mongoose'),
    Listing = require('../models/listings.server.model.js');

/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message.
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions, refer back to this tutorial
  from assignment 3 https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  //We must also add a requirement for address as specified in the assignment.
  if(req.results && req.results.address) {
    listing.coordinates = {
      longitude: req.results.lng,
      latitude: req.results.lat
    };
  }

  /* Then save the listing */
  listing.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      //Else, Sends a JSON response composed of a stringified
      //version of the specified data
      res.json(listing);
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing */
exports.update = function(req, res) {
  var listing = req.listing;

  /* Replace the article's properties with the new properties found in req.body */
  listing.address = req.body.address;
  listing.name = req.body.name;
  listing.code = req.body.code;

  /* save the coordinates (located in req.results if there is an address property) */
  //Same as above. Must add check that address exists.
  if (req.results && req.results.address) {
    listing.coordinates = {
      latitude: req.results.lat,
      longitude: req.results.lng
    };
  }

  /* Save the article */
  listing.save(function(error) {
    if (error) {
      //Send 400 if error
      res.status(400).send(error);
    }
    else {
      //Else, Sends a JSON response composed of a stringified
      //version of the specified data
      res.json(listing);
    }
  });
};







/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;

  /* Remove the article */
  Listing.remove({code:listing.code}, function(error) {
    if (error) {
      //Send 400 if error
      res.status(400).send(error);
    }
    else {
      //Else, Sends a JSON response composed of a stringified
      //version of the specified data
      res.json(listing);
    }});};





/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {

  /* Your code here */
  //Retrieve all listings, sort alphabetically
  Listing.find().sort({code:1}).exec(function(error, listings) {
    if(error) {
      //Send 400 if error
      res.status(400).send(error);
    } else {
      //Else, Sends a JSON response composed of a stringified
      //version of the specified data
      res.json(listings);
    }});};

/*
  Middleware: find a listing by its ID, then pass it to the next request handler.

  HINT: Find the listing using a mongoose query,
        bind it to the request object as the property 'listing',
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};
