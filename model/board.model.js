var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardSchema = new Schema({
  name: { type: String, minlength: 1, maxlength: 215 }, 
  boardLabels: [{ id: { type: Schema.Types.ObjectId }, name: String, colour: String }],
  background: String,
  image: String,
  closed: Boolean,
  archives: Array,
  cardArchive: Array,

  permissions: {
    addingComments: Boolean,
    addingLists: Boolean,
    addingCards: Boolean,
    addingPeopleToTheBoard: Boolean,
    addingPeopleToTheCards: Boolean,
    theVisibilityOfTheBoard: Boolean
  },

  activity: [{
    user: { type: String, required : true },
    information: { type: String, required : true },
    date: Date
  }],

  lists: [{
    list: { type: String, minlength: 1, required: true},
    cards: [{ 
      name: { type: String, minlength: 1, required : true},
      description: String,
      labels: [{ _id: Schema.Types.ObjectId, name: { type: String, maxlength: 25 }, colour: String }],
      members: [{ type: Schema.Types.ObjectId, ref: 'User' }],

      deadline: { type: Date },
      image: String,

      comments: [{
        text: { type: String, maxlength: 255, minlength: 1, required: true },
        authorID: { type: Schema.Types.ObjectId, ref: 'User' },
        name: String,
        created: { type: Date, default: Date.now }
      }],
      
      attachments: [{
        fieldname: String,
        originalname: String,
        mimetype: String,
        destination: String,
        fieldname: String,
        path: String,
        size: Number,
        created: { type: Date, default: Date.now }
      }],
      listsTasks: [{ name: { type: String, required: true, minlength: 1, maxlength: 50 }, percent: Number, tasks: [] }],
    }]
  }],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Board', BoardSchema);

var Board = require('../model/board.model');

// module.exports.updateBoard = function (req) {

//   var name = req.name;
//   var query = {};

//   query.$set = { [name]: req.value };

//   console.log(req)
//   return new Promise((resolve, reject) => {
//     Board.findOneAndUpdate({ _id: req.idBoard }, query, { upsert: true })
//       .then((updated) => { 
//         resolve(updated);
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//   });
// };

module.exports.updateBoard = function (obj) {
  
  console.log(obj)

  return new Promise((resolve, reject) => {
    Board.findOneAndUpdate({ _id: obj.idBoard }, obj.query, { upsert: true })
      .then((updated) => { 
        resolve(updated);
      })
      .catch((err) => {
        console.log(err);
      })
  });
};



// module.exports.validateBoardInput = function (req, type) {
//   //REGISTER 
//   if (type == 'comment') {
//     req.check('edittxt', 'Nazwa jest wymagana').notEmpty();
//     req.check('edittxt', 'Za krótka nazwa zadania.').isLength({ min: 1 }); 
//   }

//   //LOGIN
//   if (type == 'login') {
//     req.check('username', 'Login jest wymagany').notEmpty();
//     req.check('password', 'Hasło jest wymagane').notEmpty();
//     req.check('password', 'Za krótkie hasło.').isLength({ min: 7 });
//   }


//   //INFORMATION
//   if (type == 'information') {
//     req.check('firstName', 'Imię jest wymagane.').notEmpty();
//     req.check('firstName', 'Za krótkie imię.').isLength({ min: 2 });
//     req.check('firstName', 'Za długie imię.').isLength({ max: 50 });
//     req.check('surname', 'Nazwisko jest wymagane.').notEmpty();
//     req.check('surname', 'Za krótkie nazwisko.').isLength({ min: 2 });
//     req.check('surname', 'Za długie nazwisko.').isLength({ max: 50 });
//   }

//   //PROFILE
//   if (type == 'profile') {
//     req.check('firstName', 'Imię jest wymagane.').notEmpty();
//     req.check('firstName', 'Za krótkie imię.').isLength({ min: 2 });
//     req.check('firstName', 'Za długie imię.').isLength({ max: 50 });
//     req.check('surname', 'Nazwisko jest wymagane.').notEmpty();
//     req.check('surname', 'Za krótkie nazwisko.').isLength({ min: 2 });
//     req.check('surname', 'Za długie nazwisko.').isLength({ max: 50 });
//     req.check('city', 'Miasto jest wymagane.').notEmpty();
//     req.check('city', 'Za krótkie miasto.').isLength({ min: 2 });
//     req.check('city', 'Za długie miasto.').isLength({ max: 50 });
//     req.check('country', 'Państwo jest wymagane.').notEmpty();
//     req.check('country', 'Za krótkie państwo.').isLength({ min: 2 });
//     req.check('country', 'Za długie państwo.').isLength({ max: 50 });
//     req.check('phone', 'Numer telefonu jest wymagane.').notEmpty();
//     req.check('phone', 'Za krótki numer telefonu.').isLength({ min: 7 });
//     req.check('phone', 'Za długi numer telefonu.').isLength({ max: 10 });
//   }
//   // PASSWORD 
//   if (type == 'password') {
//     req.check('oldpassword', 'Stare hasło jest wymagane.').notEmpty();
//     req.check('oldpassword', 'Za krótkie hasło.').isLength({ min: 7 });
//     req.check('password', 'Hasła nie pasują do siebie.').equals(req.body.confirmPassword);
//     req.check('password', 'Hasło jest wymagane.').notEmpty();
//     req.check('password', 'Za krótkie hasło.').isLength({ min: 7 });
//     req.check('confirmPassword', 'Haslo jest wymagane.').notEmpty();
//     req.check('confirmPassword', 'Za krótkie hasło.').isLength({ min: 7 });
//   }

//   var errors = req.validationErrors(true);

//   return errors;
// }