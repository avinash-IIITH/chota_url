var express = require('express');
var router = express.Router();
var path = require('path');
let date = require('date-and-time');
var dateFormat = require('dateformat');

var base58 = require('../base58.js');
var Url = require('../models/url');
var urlDetails = require('../models/urldetails');
//var UrlCounters = require('../models/');		//TODO : write database name and correct the database
var config = require('../config');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('tinyurl');
});

router.get('/dashboard', ensureAuthenticated, function(req, res){
	//console.log(req.user.username);

	Url.find({username: req.user.username}, function (err, url_list) {
		var arr = [];

		url_list.forEach(function(value){
			var temp = {};
			temp['_id'] = value._id;
			temp['long_url'] = value.long_url;
			temp['counter'] = value.counter;
			var shortUrl = config.webhost + 'tinyurl/' + base58.encode(value._id);
			temp['shorturl'] = shortUrl;
			arr.push(temp);
			console.log(shortUrl);
		});
		res.render('index',{
			url_list: arr
		});
		console.log(arr);
	})
	
});

router.get('/graph', ensureAuthenticated, function(req, res){
//console.log("Present");
//res.send("hi");
Url.find({username: req.user.username}, function (err, url_list) {				//TODO : use UrlCounters once corrected
	var arr = [];

	url_list.forEach(function(value){
		var temp = {};
		
		temp['_id'] = value._id;
		temp['long_url'] = value.long_url;
		
		arr.push(temp);
		console.log(arr);
	});

res.render('graph',{
	url_list : arr
});
console.log(arr);
});

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
		    username: req.user.username,
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
  var longurl="";
  console.log('encoded_id ' + base58Id);

  	var day = new Date();
	//date.format(d, 'MMM DD YYYY');
	var d=dateFormat(day, "yyyy-mm-dd"); 
	console.log(d);

	var query1 = {id:id, created_at:d}
		, update1 = { $inc: { counter: 1 }}
		, options1 = { multi: false };

	urlDetails.findOneAndUpdate(query1, update1, options1, function(err, doc){
	    if (doc) {
	      console.log("Got the document");
	    } else {
	    	console.log("Didnt Get the document");
	      var urlDetail = urlDetails({
	      	id:id,
		    created_at:d,
		    counter: 1
		  });

		  
		  urlDetail.save(function(err) {
			    if (err){
			      console.log(err);
			    }
	    	});
	    	//res.redirect(longurl);
		}

	});


	var query = {_id:id}
		, update = { $inc: { counter: 1 }}
		, options = { multi: false };

	Url.findOneAndUpdate(query, update, options, function(err, doc){
	    if (doc) {
	      // found an entry in the DB, redirect the user to their destination
	      res.redirect(doc.long_url);
	      //longurl = doc.long_url;
	    } else {
	      // nothing found, redirect to home page
	      res.redirect('/error');
	    }
	});


});


router.get('/tinyurl/del/:encoded_id', ensureAuthenticated, function(req, res){
  var base58Id = req.params.encoded_id;
  var id = base58.decode(base58Id);
  console.log('encoded_id ' + id);
	var query = {_id:base58Id};

	Url.findByIdAndRemove(query, function(err, doc){
	    if (doc) {
	      // found an entry in the DB, redirect the user to their destination
	      req.flash('success_msg', 'URL successfully removed');
	      res.redirect('/dashboard');
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