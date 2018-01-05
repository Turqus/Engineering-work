var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
// MODELS
var User = require('../model/user.model');
var Board = require('../model/board.model'); 
const saltRounds = 10;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/boards', function (req, res, next) {
  res.render('boards', { user: req.user });
});




// GIVEN BOARD
router.get('/b/:id', function (req, res, next) {
  Board.findById(req.params.id)
    .then((board) => {
      return res.render('board', { title: 'Express', board: board });
    })
    .catch((err) => {
      console.log(err)
    })
});

// REGISTER USER
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/registerUser', function (req, res, next) {
  var errors = '';

  var newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: 'admin',

    firstName: null,
    surname: null,
    country: null,
    city: null,
    phone: null,
    initial: null,
    biography: null,
    initials: null
  }

  if (errors) {
  } else {
    bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
      if (err) {
        console.log(err)
      } else {
        newUser.password = hash;
        var user = new User(newUser);
        user.save()
          .then(function (User) {
            //res.send(User);
            req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/');
          })
      }
    });
  }
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      // console.log(user)
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }


      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));


passport.serializeUser(function (user, done) {
  done(null, user.id);
});


passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


router.post('/login',
  passport.authenticate('local', { failureRedirect: '/', failureFlash: 'Invalid username or password.' }), function (req, res) {
    if (req.user.role == 'admin') {
      // console.log(req.user)
      req.flash('success_msg', 'You are logged in');
      res.redirect('/boards');
    }
    else if (req.user.role == 'user') {
      // console.log(req.user)
      req.flash('success_msg', 'You are logged in');
      res.redirect('/product/list');
    }
    else {
      req.flash('success_msg', 'You are logged in');
      res.redirect('/product/list');
    }
  });


// PROFIL USER
router.get('/:username', function (req, res, next) {
  console.log(req.user)

  User.findById(req.user._id)
    .then((user) => {
      return res.render('profil', { title: 'Express', user: user });
    })
    .catch((err) => {
      console.log(err)
    })
});

module.exports = router;
