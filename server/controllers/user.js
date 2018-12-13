const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');
const async = require('async');
const crypto = require('crypto');
const mailProvider = require('../utils/mailProvider').mailProvider;

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
exports.resetpassword = function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          done(err, user);
        });
      });
    },
    function(user, done) {
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      mailProvider.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.status(200).send({message:'password is reset'});
  });
};

exports.forgotpassword = function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            res.status(404).send({error:'email not found'});
            // return res.redirect('/forgot');
            return;
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/user/resetpassword/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        console.log(mailOptions);
        mailProvider.sendMail(mailOptions, function(err) {
          if(err) {
            console.log(err);
          }
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      console.log(err);
      if (err) return next(err);
      res.status(200).send({message:'reset password email is sent'});
    });
};

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user), id:req.user.id});
}

exports.signup = function(req, res, next) {
    console.log('signup');

  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;


  if (!email || !password || !phone) {
    return res.status(422).send({ error: 'You must provide email, phone and password'});
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password,
      phone:phone
    });

    user.save(function(err) {
      if (err) { return next(err); }


      // Repond to request indicating the user was created
      res.json({ token: tokenForUser(user), id:user.id});
    });
  });
}
