var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;


var Board = require('../model/board.model');
var User = require('../model/user.model');

router

  .post('/change-status', function (req, res) {
    var obj = {
      name: "notifications.readed",
      value: true,
      idUser: req.user._id
    };

    User.updateUser(obj)
      .then(resp => {
        let respond = resp;
        res.json(respond);
      })
  })
 

  .get('/usercards', function (req, res) {
    var good = ObjectId("5a1db9e8db97d318ac70715d");

    var pipeline =
      [
        {
          "$project": {
            "name": 1,
            "boardcards": {
              "$reduce": {
                "input": "$lists.cards",
                "initialValue": [],
                "in": {
                  "$concatArrays": ["$$value", {
                    "$filter": {
                      "input": "$$this",
                      "as": "result",
                      "cond": { "$in": [good, { "$ifNull": ["$$result.members", []] }] }
                    }
                  }
                  ]
                }
              }
            }
          }

        },
        {
          "$unwind": "$boardcards"
        }
      ];

    var check = [];

    Board.aggregate(pipeline, function (err, result) {
      if (err) res.send(err);
      // console.log(JSON.stringify(result, undefined, 4)); 
      // res.send(result);
    })

    result.forEach((element, key) => {
      User.find({ _id: element.boardcards.members })
        .then((users) => {
          // console.log(result)
          console.log(key);
          check[key].boardcards.members = users;
        })
    })
    console.log(check)
  })


  



module.exports = router;
