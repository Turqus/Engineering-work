var express = require('express');
var router = express.Router();
var Board = require('../model/board.model');

router.post('/copy-list', (req, res) => { 
    Board.findOneAndUpdate({ _id: req.body.idBoard },
        {
            $set: {
                lists: req.body.lists
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
 

router.post('/copy-board', function (req, res, next) {
    var newBoard = req.body;  
    var board = new Board(newBoard);
    console.log('reqbody', req.body)
    console.log('varible', board)
  
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
 



router.post('/transfer-list', (req, res) => {
    let transferObj = req.body;
console.log(transferObj)
    if (transferObj.isSame === true) {
        Board.findOneAndUpdate({ _id: transferObj.idBoard },
            {
                $set: {
                    lists: transferObj.lists,
                }
            },
            {
                upsert: true
            },
            ((err, updated) => {
                if (err) { console.log(err) }
                else { res.status(200).send('Transfered'); }
            })
        )
    } else {
        Board.findOneAndUpdate({ _id: transferObj.idBoard },
            { $set: { lists : transferObj.lists, } }, { upsert: true })
            .then(() => {
                Board.findOneAndUpdate({ _id: transferObj.toBoard },
                    { $set: { lists: transferObj.lists, } }, { upsert: true },
                    ((err, updated) => {
                        if (err) { console.log(err) }
                        else { res.status(200).send('Transfered'); }
                    })
                );
            })
    }
});


module.exports = router;
