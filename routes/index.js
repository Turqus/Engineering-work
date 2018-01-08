var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
// MODELS
var User = require('../model/user.model');
var Board = require('../model/board.model');
const saltRounds = 10;
var nodemailer = require('nodemailer');

var createHash = require('hash-generator');
var hashLength = 18;
var hashKey = createHash(18);



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
  //sending email  

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'turqus18@gmail.com',
      pass: 'Chudy129'
    }
  });



  //end sending email

  var errors = '';

  var newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: 'admin',

    // keyHash: null,
    // forgotPasswordHash: null,
    activated: false,
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
        bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
          if (err) {
            console.log(err)
          } else {
            newUser.keyHash = hashKey;
            var user = new User(newUser);
            user.save()
              .then(function (User) {
                //res.send(User);
                req.flash('success_msg', 'You are registered and can now login');
                res.redirect('/');
              })
              .then(() => {
                // start
                var mailOptions = {
                  from: 'turqus18@gmail.com',
                  to: 'bartlomiejflis94@gmail.com',
                  subject: 'Aktywacja Twojego konta tasker !',
                  html: 'Witaj <b>' + newUser.username + '<br /><br/>Aktywacja twojego konta na naszej stronie internetowej Tasker.</b><br /><br/><span>Kliknij w poniższy link w celu aktywacji: </span> <br /><br /> http://localhost:3000/activated/' + newUser.keyHash
                };


                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    res.json('Wiadomość nie zostałą wysłana.');
                  } else {
                    console.log('Email sent: ' + info.response);
                    res.json('Wiadomość została wysłana.');
                  }
                });
                // end
              })
          }
        });
      }
    });
  }
});

router.get('/activated/:hash', (req, res) => {
  User.find({ 'keyHash': req.params.hash }, (err, user) => {
    if (err) {
      console.log(err);
    }
    else {
      if (user.length > 0) {

        User.findOneAndUpdate({ _id: user[0]._id },
          {
            $set: {
              keyHash: null,
              activated: true
            }
          },
          {
            upsert: true
          },
          ((err, user) => {
            if (err) {
              console.log(err)
            }
            else {
              console.log(user)
              res.send('Konto zostało aktywowane.');
            }
          })
        )
      } else {
        res.send('Podany klucz nie istnieje.');
      }
    }
  })
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
// router.get('/:username', function (req, res, next) {
//   console.log(req.user)

//   User.findById(req.user._id)
//     .then((user) => {
//       return res.render('profil', { title: 'Express', user: user });
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// });

module.exports = router;
