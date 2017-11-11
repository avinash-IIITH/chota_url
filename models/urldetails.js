var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema for our links
var urlDetailsSchema = new Schema({
  id: Number,
  created_at: Date,
  counter: Number,
});

var urlDetails = mongoose.model('urlDetails', urlDetailsSchema);

module.exports = urlDetails;