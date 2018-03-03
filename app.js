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
var loginSystem = require('./routes/login-system');
var profile = require('./routes/profile');
var boardRouter = require('./routes/board');
var users = require('./routes/users');
var card = require('./routes/card');
var permissions = require('./routes/permissions');
var remindPassword = require('./routes/remindPassword');
 

var User = require('./model/user.model'); 
var Board = require('./model/board.model');
var mongoose = require('mongoose');

var app = express();
var expressValidator = require('express-validator');
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
 
 
    app.use(flash());
 
    app.use(function (req, res, next) {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;
      next();
    });

 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'public')));


app.use(expressValidator({
  errorFormatter: function(param, msg, value){
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

      while(namespace.length) {
          formParam += '[' + namespace.shift()
      }
      return{
          param: formParam,
          msg: msg,
          value: value
      };
  }
}));



app.use('/', loginSystem);
app.use('/', remindPassword);
app.use('/users', validateEntrance, users); 
app.use('/profile', validateEntrance, profile);
app.use('/card', validateEntrance, card);
app.use('/permissions', validateEntrance,permissions);
app.use('/', validateEntrance, index);
app.use('/board', validateEntrance, boardRouter);

function validateEntrance(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'Proszę się zalogować aby kontynuować.');
    res.redirect('/');
  }
}



 
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
 
app.use(function(err, req, res, next) { 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  res.status(err.status || 500);
  res.render('error');
});
 
  }
});

module.exports = app;
