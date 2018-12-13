const UserController = require('./controllers/user');
const Category = require('./controllers/category');
const Item = require('./controllers/item');
const passportService = require('./services/passport');
const passport = require('passport');
const User = require('./models/user');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

let multer = require('multer');
let upload = multer();

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  app.post('/user/signin', requireSignin, UserController.signin);
  app.post('/user/signup', UserController.signup);
  app.post('/user/forgotpassword', UserController.forgotpassword);
  app.post('/user/resetpassword/:token', UserController.resetpassword);
  app.post('/user/resetpassword', UserController.resetpassword);
  
  app.get('/user/resetpassword/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
        user: req.user
      });
    });
  });
  app.get('/user/forgotpassword', function(req, res) {
    res.render('forgot', {
      user: req.user
    });
  });

  app.get('/signup', function(req, res) {
    res.render('signup', {
      user: req.user
    });
  });
  app.get('/', function(req, res){
    res.render('index', {
      title: 'Express',
      user: req.user
    });
  });
  
  app.get('/login', function(req, res) {
    res.render('login', {
      user: req.user
    });
  });

  app.get('/category', Category.get_all_categories);
  app.get('/category/:id', Category.get_category_by_id);
  app.get('/item', Item.get_all_items);
  app.get('/item/:id', Item.get_item_by_id);
  app.post('/category', Category.create_category);
  app.put('/category', Category.update_category);
  app.delete('/category', Category.delete_category);

  app.post('/item', Item.create_item);
  app.put('/item', Item.update_item);
  app.delete('/item', Item.delete_item);

  app.post('/send', upload.fields([]), (req, res) => {
    let formData = req.body;
    console.log('form data', formData);
    res.sendStatus(200);
  });

}