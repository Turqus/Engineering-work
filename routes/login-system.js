var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var createHash = require('hash-generator');
var hashKey = createHash(18);
var User = require('../model/user.model');
var hashLength = 18;
const saltRounds = 10;

router

  .get('/', function (req, res) {
    if(req.user) res.redirect('/boards');
    else res.render('index', { title: 'Strona Główna' });
  })
  .get('/login', function (req, res) {
    res.render('login', { title: 'Logowanie' });
  })
  .get('/register', function (req, res) {
    res.render('register', { title: 'Rejestracja' });
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
              res.send('Konto zostało aktywowane.');
            }
          })
        )
      } else {
        res.send('Podany klucz nie istnieje.');
      }
    }
  })
})

  .post('/login',
  passport.authenticate('local', { failureRedirect: '/', failureFlash: 'Niepoprawna nazwa użytkownika lub hasło.' }), function (req, res) {

    var errors = User.validateUserInput(req, 'login');
    console.log(errors);

    if (req.user || errors) {
      req.flash('success_msg', 'Zostałeś zalogowany.');
      res.redirect('/boards');
    } else {
      // req.flash('error_msg', 'Niepoprawny login lub hasło');
      // res.redirect('/');

    console.log(errors);

    }
  })

  .get('/logout', function (req, res) {
    req.logOut();
    req.flash('success_msg', 'Zostałeś wylogowany.');
    res.redirect('/');
  })

  .get('/profile/:username', function (req, res, next) {
    User.findById(req.user._id)
      .then((user) => {
        return res.render('profil', { title: 'Profil Użytkownika', user: user });
      })
      .catch((err) => {
        console.log(err)
      })
  });


router.post('/registerUser', function (req, res, next) {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'turqus18@gmail.com',
      pass: 'Chudy129'
    }
  });

  var errors = '';

  var newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    activated: false,
    firstName: null,
    surname: null,
    country: null,
    city: null,
    phone: null,
    biography: null,
    initials: null,
    notifications: {
      readed: true,
      note: []
    }
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
                req.flash('success_msg', 'Zostałeś zarejestrowany, teraz możesz się zalogować.');
                res.redirect('/');
              })
              .then(() => {
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
              })
          }
        });
      }
    });
  }
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Niepoprawny login.' });
      }

      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Niepoprawne hasło' });
        }
      });
    });
  }))

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
})

module.exports = router;
