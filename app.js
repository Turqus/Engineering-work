var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

var index = require('./routes/index');
var profile = require('./routes/profile');
var boardRouter = require('./routes/board');
var users = require('./routes/users');
var card = require('./routes/card');
 
var User = require('./model/user.model');
var Board = require('./model/board.model');
var mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/Trello', function (error) {
  if (error) {
    console.log('blad w polaczeniu')
  } else {
    console.log('connected');

    app.use(session({
      secret: 'dadasdasdaxsax',
      resave: true,
      saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
 

   // Connect Flash
    app.use(flash());

    // Global Vars
    app.use(function (req, res, next) {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;
      next();
    });


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/admin', users);
app.use('/profile', profile);
app.use('/board', boardRouter);
app.use('/card', card);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

    //=========================CONNNNNNECTTTTTTEEEEEEDDDDDDDDDDDDDDDD======================//
  }
});

module.exports = app;
