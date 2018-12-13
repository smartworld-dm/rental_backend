const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./router');
var flash = require('express-flash');
// const seed = require('./models/seed');
const PORT = process.env.PORT || 8000;
var session = require('express-session')

const app = express();

  // DB Setup

mongoose.connect('mongodb://root:rentall1@ds127954.mlab.com:27954/rentall', { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
// require('./models/seed2');

// App Setup
app.set('view engine', 'jade');
app.use(morgan('combined'));
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 's3cr3t',
  resave: true,
  saveUninitialized: true
}));
// app.use(bodyParser.json({ type: '*/*' }));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
router(app);

// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!, were lit!!!!!"}');
});
// All remaining requests return the React app, so it can handle routing.

var server = app.listen(PORT, function () {
  console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
});

