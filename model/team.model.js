var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TeamSchema = new Schema({
  name: { type: String },
  // lists : { type: Array },

 
  lists : [{ 
    list: String,
    cards: [{ 
      name: String,
      Author: [{type : Schema.Types.ObjectId, ref: 'User'}],
      comments: [{ text: String, authorID: {type : Schema.Types.ObjectId, ref: 'User'}, name: String }]
    }]
  }],

  users : [{ type : Schema.Types.ObjectId, ref: 'User' }],


});

module.exports = mongoose.model('Team', TeamSchema);