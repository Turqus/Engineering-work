var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BoardSchema = new Schema({
  name: String ,
  // availability: String ,
  boardLabels : [{ id: {type : Schema.Types.ObjectId}, name: String, colour: String}],
  background : String,
  closed: Boolean,
  archives: Array,
  cardArchive: Array,
  // lists : { type: Array },
  
 
  lists : [{ 
    list: String,
    cards: [{ 
      subscription: Boolean,
      name: String,
      description: String,
      labels : [   { _id : Schema.Types.ObjectId, name : String, colour : String}  ],
      Author: [{type : Schema.Types.ObjectId, ref: 'User'}],
       
      deadline: { type: Date },

      comments: [{ 
        text: String, 
        authorID: {type : Schema.Types.ObjectId, ref: 'User'}, 
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

      listsTasks: [{name : String, percent : Number, tasks : []}]
    }]
  }],
  users : [{ type : Schema.Types.ObjectId, ref: 'User' }],


});

module.exports = mongoose.model('Board', BoardSchema);