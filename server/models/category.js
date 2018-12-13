var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('category', CategorySchema);