var express = require('express');
var router = express.Router();

var Board = require('../model/board.model');

router.post('/copy-board', function (req, res, next) {

    // var newBoard = {
    //     name: req.body.name,
    //     closed : req.body.closed,
    //     background: req.body.background,
    //     lists: req.body.lists,
    //     users: req.body.users,
    //     boardLabels: req.body.boardLabels
    //   }

      var newBoard = req.body;
    

    var board = new Board(newBoard);
  
    board.save()
      .then(function (boards) {
        res.send(boards);
      })
      .catch((err) => {
        console.log(err)
      })
  });
  


router.put('/change/background', (req, res) => {
    Board.findOneAndUpdate({ _id: req.body._id },
        {
            $set: {
                background: req.body.background
            }
        },
        {
            upsert: true
        },
        ((background) => {
            console.log(background)
            res.send(background)
        })
    )
}); 


router.post('/toggle-board', (req, res) => {
    Board.findOneAndUpdate({ _id: req.body.idBoard },
        {
            $set: {
                closed: req.body.closed
            }
        },
        {
            upsert: true
        },
        ((board) => {
            console.log(board)
            res.send(board)
        })
    )
}); 
 


module.exports = router;
