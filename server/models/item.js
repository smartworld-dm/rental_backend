var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  price: String,
  small_description:  { 
    type: String,
    maxlength:200,
  },
  full_description: String,
  title: String,
  active: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  quantity:Number,
});

module.exports = mongoose.model('item', ItemSchema);