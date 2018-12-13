'use strict';

/* jshint maxlen: false */
/* jshint quotmark: false */
/* jshint newcap: false */

var _                    = require('lodash');
var mongoose             = require('mongoose');
var Category                 = mongoose.model('category');
var ObjectId             = mongoose.Types.ObjectId;

// function clearDb() {
//   var ops = _(mongoose.models)
//     .keys()
//     .map(modelName => mongoose.model(modelName).remove())
//     .value();

//   return Promise.all(ops);
// }

function insertUsers() {
  var categories = [
    { "_id" : ObjectId("57fa20920cb5ff30ec85742f"),"name":"category1"},
  ];
  return Category.create(categories);
}


  insertUsers()
  .then(() => console.log('All scripts applied succesfully'))
  .catch(err => console.log('The scripts are not applied', err))
