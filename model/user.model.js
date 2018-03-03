var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  username: { type: String, maxlength: 20, minlength: 7, required: true, unique: true },
  password: { type: String, minlength: 7, required: true },
  email: { type: String, maxlength: 50, required: true },

  activity: [{
    information: String,
    date: Date
  }],

  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
  activated: Boolean,
  keyHash: String,
  remindPasswordHash: String,

  firstName: { type: String, minlength: 2, maxlength: 50 },
  surname: { type: String, minlength: 2, maxlength: 50 },
  country: { type: String, minlength: 2, maxlength: 50 },
  city: { type: String, minlength: 2, maxlength: 50 },

  phone: { type: Number, minlength: 7, maxlength: 10 },
  biography: { type: String, maxlength: 80 },
  notifications: {
    readed: Boolean,
    note: [
      {
        user: String,
        information: String,
        date: Date
      }
    ]
  }

});

module.exports = mongoose.model('User', UserSchema);
module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}

var User = require('../model/user.model');

module.exports.updateUser = function (req) {
  var name = req.name;
  var query = {};
  query.$set = { [name]: req.value };
  console.log(req)
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: req.idUser }, query, { upsert: true })
      .then((updated) => {
        resolve(updated);
      })
      .catch((err) => {
        console.log(err);
      })
  });
};

module.exports.validateUserInput = function (req, type) {
  //REGISTER
  if (type == 'register') {
    req.check('username', 'Login jest wymagany').notEmpty();
    req.check('username', 'Za krótka nazwa użytkownika.').isLength({ min: 7 });
    req.check('username', 'Za krótka nazwa użytkownika.').isLength({ max: 20 });
    req.check('email', 'Nieprawidłowy adres e-mail').isEmail();
    req.check('password', 'Hasło nie pasuje do siebie.').equals(req.body.confirmPassword);
    req.check('password', 'Hasło jest wymagane').notEmpty();
    req.check('password', 'Za krótkie hasło.').isLength({ min: 7 });
    req.check('confirmPassword', 'Hasło jest wymagane.').notEmpty();
    req.check('confirmPassword', 'Za krótkie hasło.').isLength({ min: 7 });
  }

  //LOGIN
  if (type == 'login') {
    req.check('username', 'Login jest wymagany').notEmpty();
    req.check('password', 'Hasło jest wymagane').notEmpty();
    req.check('password', 'Za krótkie hasło.').isLength({ min: 7 });
  }


  //INFORMATION
  if (type == 'information') {
    req.check('firstName', 'Imię jest wymagane.').notEmpty();
    req.check('firstName', 'Za krótkie imię.').isLength({ min: 2 });
    req.check('firstName', 'Za długie imię.').isLength({ max: 50 });
    req.check('surname', 'Nazwisko jest wymagane.').notEmpty();
    req.check('surname', 'Za krótkie nazwisko.').isLength({ min: 2 });
    req.check('surname', 'Za długie nazwisko.').isLength({ max: 50 });
  }

  //PROFILE
  if (type == 'profile') {
    req.check('firstName', 'Imię jest wymagane.').notEmpty();
    req.check('firstName', 'Za krótkie imię.').isLength({ min: 2 });
    req.check('firstName', 'Za długie imię.').isLength({ max: 50 });
    req.check('surname', 'Nazwisko jest wymagane.').notEmpty();
    req.check('surname', 'Za krótkie nazwisko.').isLength({ min: 2 });
    req.check('surname', 'Za długie nazwisko.').isLength({ max: 50 });
    req.check('city', 'Miasto jest wymagane.').notEmpty();
    req.check('city', 'Za krótkie miasto.').isLength({ min: 2 });
    req.check('city', 'Za długie miasto.').isLength({ max: 50 });
    req.check('country', 'Państwo jest wymagane.').notEmpty();
    req.check('country', 'Za krótkie państwo.').isLength({ min: 2 });
    req.check('country', 'Za długie państwo.').isLength({ max: 50 });
    req.check('phone', 'Numer telefonu jest wymagane.').notEmpty();
    req.check('phone', 'Za krótki numer telefonu.').isLength({ min: 7 });
    req.check('phone', 'Za długi numer telefonu.').isLength({ max: 10 });
  }
  // PASSWORD 
  if (type == 'password') {
    req.check('oldpassword', 'Stare hasło jest wymagane.').notEmpty();
    req.check('oldpassword', 'Za krótkie hasło.').isLength({ min: 7 });
    req.check('password', 'Hasła nie pasują do siebie.').equals(req.body.confirmPassword);
    req.check('password', 'Hasło jest wymagane.').notEmpty();
    req.check('password', 'Za krótkie hasło.').isLength({ min: 7 });
    req.check('confirmPassword', 'Haslo jest wymagane.').notEmpty();
    req.check('confirmPassword', 'Za krótkie hasło.').isLength({ min: 7 });
  }

  var errors = req.validationErrors(true);

  return errors;
}