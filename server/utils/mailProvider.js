'use strict';
var nodemailer     = require('nodemailer');
var options = {
  service: 'gmail',
  auth: {
      user: 'sharing4items@gmail.com',
      pass: 'sh4it2Ava'
  },
  debug:true
};

var mailProvider = nodemailer.createTransport(options);
exports.mailProvider = mailProvider;
