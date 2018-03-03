var express = require('express');
var router = express.Router();
var User = require('../model/user.model');
var bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/update/information', function (req, res) {
    var add = req.body;
    var errors = User.validateUserInput(req, 'information');

    if (errors) {
        console.log(errors);
    } else {
        User.findOneAndUpdate({ _id: add._id },
            {
                $set: {
                    firstName: add.firstName,
                    surname: add.surname,
                    biography: add.biography
                }
            },
            {
                upsert: true
            },
            ((err, updated) => {
                if (err) throw err;
                else res.json('Profil został zaktualizowany.');
            })
        )
    }
});

router.post('/update/personal/information', function (req, res) {
    var add = req.body;
    var errors = User.validateUserInput(req, 'profile');

    if (errors) {
        console.log(errors);
    } else {
        User.findOneAndUpdate({ _id: add._id },
            {
                $set: {
                    firstName: add.firstName,
                    surname: add.surname,
                    country: add.country,
                    city: add.city,
                    phone: add.phone
                }
            },
            {
                upsert: true
            },
            ((err, updated) => {
                if (err) throw err;
                else res.json('Profil został zaktualizowany.');
            })
        )
    }
});



router.post('/change-password', function (req, res, next) {
    console.log(req.body)

    var errors = User.validateUserInput(req, 'password');

    User.comparePassword(req.body.oldPpassword, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Invalid password' });
        }
    });

    // var errors = req.validationErrors(true);

    // if (errors) {
    //     console.log(errors);
    // } else {
    //     bcrypt.hash(req.body.newPassword, saltRounds, function (err, hash) {
    //         if (err) console.log(err)
    //         else {
    //             User.findOneAndUpdate({ _id: req.user._id },
    //                 {
    //                     $set: {
    //                         password: hash
    //                     }
    //                 },
    //                 {
    //                     upsert: true
    //                 },
    //                 ((err) => {
    //                     if (err) {
    //                         req.flash('error_msg', 'Hasło nie zostało zmienione');
    //                         res.redirect('/' + req.user.username);
    //                     }
    //                     else {
    //                         req.flash('success_msg', 'Hasło zostało zmienione');
    //                         res.redirect('/' + req.user.username);
    //                     }
    //                 }))
    //         }
    //     });
    // }
});


module.exports = router;






