var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../model/user.model');
var nodemailer = require('nodemailer');
var createHash = require('hash-generator');
var hashLength = 18;
var hashKey = createHash(18);
const saltRounds = 10;

router.get('/remind-password', function (req, res, next) {
    res.render('remind-password', { title : 'Przypomnij hasło' });
});

router.post('/remind-password', (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'turqus18@gmail.com',
            pass: 'Chudy129'
        }
    });

    User.find({ username: req.body.username }, (err, user) => {
        var error;
        if (user.length > 0) {
            User.findOneAndUpdate({ _id: user[0]._id },
                { $set: { remindPasswordHash: hashKey } },
                { upsert: true },
                ((err, user) => {
                    if (err) { console.log(err) }
                    else {
                        let mailOptions = {
                            from: 'turqus18@gmail.com',
                            to: 'bartlomiejflis94@gmail.com',
                            subject: 'Przypomnienie twojego hasła, Tasker.',
                            html: 'Witaj <b>' + user.username + '<br /><br/> Ze wzgłedów bezpieczeństwa, aby odzyskać hasło, nalezy utworzyć nowe.</b><br /><br/><span>Kliknij w poniższy link w celu wygenerowania nowego hasła które zostanie wysłane na Twoj adres e-mail: </span> <br /><br /> http://localhost:3000/reset-password/' + hashKey
                        };

                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err) error = "Wiadomość e-mail nie zostałą wysłana. Proszę spróbować później.";
                            else {
                                console.log('Email sent: ' + info.response);
                                error = "Wiadomość e-mail została wysłana."
                                res.render('remind-password', { error: error });
                            }
                        })
                    }
                })
            )
        } else {
            error = "Nie znaleziono podanego loginu w bazie."
            res.render('remind-password', { error: error });
        }
    })
});

router.get('/reset-password/:hash', (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'turqus18@gmail.com',
            pass: 'Chudy129'
        }
    });

    User.find({ 'remindPasswordHash': req.params.hash }, (err, user) => {
        if (err) {
            console.log(err);
        }
        else {
            if (user.length > 0) {
                bcrypt.hash(hashKey, saltRounds, function (err, hash) {
                    if (err) console.log(err);
                    else {
                        var newPassword = hashKey;

                        User.findOneAndUpdate({ _id: user[0]._id },
                            {
                                $set: {
                                    password: hash,
                                    remindPasswordHash: null
                                }
                            }, { upsert: true },
                            ((err, user) => {
                                if (err) { console.log(err) }
                                else {
                                    let mailOptions = {
                                        from: 'turqus18@gmail.com',
                                        to: 'bartlomiejflis94@gmail.com',
                                        subject: 'Przypomnienie twojego hasła, Tasker.',
                                        html: 'Witaj <b>' + user.username + '<br /><br/> Twoje nowe wygenerowane automatycznie hasło to:</b><br /><br/>' + newPassword
                                    };

                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            res.send('Wiadomość z nowym hasłem nie zostałą wysłana. Proszę spróbować później');
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                            res.send('Wiadomość z nowym hasłem została wysłana.');
                                        }
                                    });
                                }
                            })
                        )

                    }
                });
            } else {
                res.send('Podany klucz nie istnieje.');
            }
        }
    })
});

module.exports = router;




