var express = require('express');
var router = express.Router();
 var ObjectId = require('mongodb').ObjectID;
 

var Board = require('../model/board.model');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/create/card', function (req, res, next) {
 console.log(req.body)
var index = req.body.cardIndex; 
// var key = "lists."+position;

// obj[key] = { cards : req.body.cards };
// Board.findOneAndUpdate({ _id: req.body.idBlackBoard }, 
// { $set: obj },
//     {
//       upsert: true
//     },
//     ((cards) => {
//       console.log(cards)
//       res.send(cards)
//     })
//   )




  Board.findOneAndUpdate({ _id: req.body.idBlackBoard },
    {
      $set: {
            ['lists.' + index + '.cards'] : req.body.cards,
      }
    },
    {
      upsert: true
    },
    ((cards) => {
      console.log(cards)
      res.send(cards)
    })
  )
});

router.post('/add/comment', function (req, res, next) {
  // var query = 'lists.'+req.body.indexList+'.cards';
  
  Board.findOneAndUpdate({ _id: req.body.idBoard },
    {
      $set: {
         lists: req.body.lists,
      }
    },
    {
      upsert: true
    },
    ((lists) => {
      console.log(lists)
      res.send(lists)
    })
  )
});



router.post('/add/member/board', function (req, res, next) {
  Board.findOneAndUpdate({ _id: req.body._id },
    {
      $set: {
          users : req.body.users
      }
    },
    {
      upsert: true
    },
    ((cards) => {
      res.send(cards)
    })
  )
});


router.post('/add/member', function (req, res, next) {
  console.log(req.body)
  Board.findOneAndUpdate({ _id: req.body._id },
    {
      $set: {
          lists : req.body.lists
      }
    },
    {
      upsert: true
    },
    ((cards) => {
      res.send(cards)
    })
  )
});




 



router.post('/create/lists', function (req, res, next) {
  Board.findOneAndUpdate({ _id: req.body.idBlackBoard },
    {
      $set: {
        lists: req.body.lists,
      }
    },
    {
      upsert: true
    },
    ((lists) => {
      res.send(lists)
    }))
});

router.post('/create/board', function (req, res, next) {

  var newBoard = {
    name: req.body.name,
    availability: null,
    closed : false,
    background: '#0079BF',
    lists: [],
    users: req.user._id,
    boardLabels: [ 
        {
            "colour" : "#61BD4F",
            "name" : "green"
        }, 
        {
            "colour" : "#F2D600",
            "name" : "yellow"
        }, 
        {
            "colour" : "#FFAB4A",
            "name" : "orange"
        }, 
        {
            "colour" : "#C377E0",
            "name" : "pink"
        } 
    ]
  }


  var board = new Board(newBoard);

  board.save()
    .then(function (boards) {
      res.send(boards);
    })
    .catch((err) => {
      console.log(err)
    })
});



// router.get('/lists', function (req, res) {
//   Blackboard.find()
//     .exec(function (err, list) {
//       if (err) {
//         res.status(404).json({
//           message: 'Can not download this list'
//         })
//       } else {
//         // console.log(list)
//         res.json(list);
//       }
//     })
// });



router.get('/usercards', function (req, res) {
var good = ObjectId("59df60fb6fad6224f4f9f22d");

var pipeline =
  [
    {
      "$project": { 
          "name":1,
        "boardcards": {
          "$reduce": {
            "input": "$lists.cards",
            "initialValue": [ ],
            "in": { "$concatArrays": [ "$$value", {
            "$filter": {
               "input": "$$this",
               "as": "result",
                "cond": { "$in": [ good, {"$ifNull":["$$result.Author", []]} ]}
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

  Board.aggregate(pipeline, function (err, result){
    if (err) res.send(err);
    console.log(JSON.stringify(result, undefined, 4));
    res.send(result);
}) 
});


router.get('/boards', function (req, res) {
  Board.find({ users : req.user._id})
    .exec(function (err, board) {
      if (err) {
        res.status(404).json({
          message: 'Can not download this board'
        })
      } else { 
        // console.log(req.user)
        res.json(board);
      }
    })
});

router.get('/selected/board', function (req, res) { 
  Board.findById({ _id : req.query._id})
    .exec(function (err, board) {
      if (err) {
        res.status(404).json({
          message: 'Can not download this board'
        })
      } else { 
        // console.log(req.user)
        res.json(board);
      }
    })
});


router.put('/updatecards', function (req, res, next) {
  Board.findOneAndUpdate({ _id: req.body._id },
    {
      $set: {
        lists: req.body.lists
      }
    },
    {
      upsert: true
    },
    ((newList) => {
      res.send(newList)
    })
  )

});

// dodawanie listy taskow 

router.post('/add/lists/tasks', function (req, res, next) { 
  var indexList = req.body.indexList;
  var indexCard = req.body.indexCard;
  var indexListOfTasks = req.body.indexListOfTasks;
  var tasks = req.body.tasks;

if(req.body.type == 'name') {
    Board.findOneAndUpdate({ _id: req.body.idBoard },
    {
      $set: {
            ['lists.' + indexList + '.cards.' + indexCard + '.listsTasks'] : tasks,
      }
    },
    {
      upsert: true
    },
    ((cards) => {
      res.send(cards)
    })
  )
} else if(req.body.type == 'task'){
    Board.findOneAndUpdate({ _id: req.body.idBoard },
    {
      $set: {
            ['lists.' + indexList + '.cards.' + indexCard + '.listsTasks.' + indexListOfTasks ] : tasks,
      }
    },
    {
      upsert: true
    },
    ((cards) => {
      res.send(cards)
    })
  )
} else {
    Board.findOneAndUpdate({ _id: req.body.idBoard },
    {
      $set: {
            ['lists.' + indexList + '.cards.' + indexCard + '.listsTasks.' + indexListOfTasks ] : req.body.status,
      }
    },
    {
      upsert: true
    },
    ((cards) => {
      res.send(cards)
    })
  )
} 

});


// dodawanie labli do kart

router.post('/add/descrip/card', function (req, res, next) { 
  var indexList = req.body.indexList;
  var indexCard = req.body.indexCard;
  var descrip = req.body.descrip;
  Board.findOneAndUpdate({ _id: req.body.idBoard },
    {
      $set: {
            ['lists.' + indexList + '.cards.' + indexCard] : descrip,
      }
    },
    {
      upsert: true
    },
    ((cards) => {
      res.send(cards)
    })
  )
});


// dodawanie labli do tablicy

router.post('/add/label/board', function (req, res, next) {
  var indexList = req.body.indexList;
  var indexCard = req.body.indexCard;
  var labels = req.body.labels;

  Board.findOneAndUpdate({ _id: req.body.idBoard },
    {
      $set: {
            boardLabels : labels,
      }
    },
    {
      upsert: true
    },
    ((cards) => {
      res.send(cards)
    })
  )
});

// dodawanie labli do kart

router.post('/add/label/card', function (req, res, next) {
  console.log(req.body._id)
  console.log(req.body)
  var indexList = req.body.indexList;
  var indexCard = req.body.indexCard;
  var labels = req.body.labels;
  Board.findOneAndUpdate({ _id: req.body.idBoard },
    {
      $set: {
            ['lists.' + indexList + '.cards.' + indexCard + '.labels'] : labels,
      }
    },
    {
      upsert: true
    },
    ((cards) => {
      res.send(cards)
    })
  )
});


router.delete('/label/delete/:id', function (req, res, next) {
  console.log(req.params)
  // User.findByIdAndRemove(req.params.id).exec(function (err, user) {
  //   if (err) {
  //     res.status(404).json({
  //       message: 'Can not delete this item'
  //     })
  //   } else {
  //     res.send(user);
  //   }
  // });
});
//

module.exports = router;
