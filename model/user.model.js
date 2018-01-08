var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  username: { type: String, maxlength: 20, required: true, unique: true },
  password: { type: String, maxlength: 202, required: true },
  email: { type: String, maxlength: 20, required: true },
  role: { type: String, maxlength: 5, required: true },
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
  activated: Boolean,
  keyHash: String,
  remindPasswordHash: String,
  firstName: { type: String, maxlength: 30},
  surname: { type: String, maxlength: 30 },
  country: { type: String, maxlength: 30 },
  city: { type: String, maxlength: 30 },
  phone: { type: Number, maxlength: 30 }, 
  biography: { type: String, maxlength: 80 }, 
  initials: { type: String, maxlength: 3 }, 
});

module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(candidatePassword, hash, callback){
    console.log(candidatePassword)
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}