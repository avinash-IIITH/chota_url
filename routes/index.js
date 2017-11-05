var express = require('express');
var router = express.Router();
var path = require('path');

var base58 = require('../base58.js');
var Url = require('../models/url');
var config = require('../config');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('tinyurl');
});

router.get('/dashboard', ensureAuthenticated, function(req, res){
	//console.log(req.user.username);
	res.render('index');
});

router.get('/tinyurl',  ensureAuthenticated, function(req, res){
	res.render('tinyurl');
});

router.post('/shorten',  ensureAuthenticated, function(req, res){
	var longUrl = req.body.url;
	var shortUrl = '';


	Url.findOne({long_url: longUrl}, function (err, doc){
		if (doc){
		  
		  shortUrl = config.webhost + 'tinyurl/' + base58.encode(doc._id);

		  
		  res.send({'shortUrl': shortUrl});
		} else {
		 
		  var newUrl = Url({
		    long_url: longUrl,
		    counter: 0
		  });

		  
		  newUrl.save(function(err) {
		    if (err){
		      console.log(err);
		    }

		    // construct the short URL
		    shortUrl = config.webhost + 'tinyurl/' +base58.encode(newUrl._id);

		    res.send({'shortUrl': shortUrl});
		  });
		}

	});
});

router.get('/tinyurl/:encoded_id', function(req, res){
  var base58Id = req.params.encoded_id;
  var id = base58.decode(base58Id);
  console.log('encoded_id ' + base58Id);
	var query = {_id:id}
		, update = { $inc: { counter: 1 }}
		, options = { multi: false };

	Url.findOneAndUpdate(query, update, options, function(err, doc){
	    if (doc) {
	      // found an entry in the DB, redirect the user to their destination
	      res.redirect(doc.long_url);
	    } else {
	      // nothing found, redirect to home page
	      res.redirect('/error');
	    }
	});

});

router.get('/tinyurl/del/:encoded_id', ensureAuthenticated, function(req, res){
  var base58Id = req.params.encoded_id;
  var id = base58.decode(base58Id);
  console.log('encoded_id ' + base58Id);
	var query = {_id:id};

	Url.findByIdAndRemove(query, function(err, doc){
	    if (doc) {
	      // found an entry in the DB, redirect the user to their destination
	      req.flash('success_msg', 'URL successfully removed');
	      res.status(200).send({'success_msg': 'URL successfully removed'});
	    } else {
	      // nothing found, redirect to home page
	      res.redirect('/error');
	    }
	});

});

router.get('/error', function(req, res){
	res.sendFile(path.join(__dirname, '../views/error.html'));
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
module.exports = router;