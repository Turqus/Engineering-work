var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var Board = require('../model/board.model');


// router.put('/change/background', function (req, res) {

// Board.findOneAndUpdate({ _id: req.body._id },
//     {
//         $set: {
//             background: req.body.background
//         }
//     },
//     {
//         upsert: true
//     },
//     ((background) => {
//         console.log(background)
//         res.send(background)
//     })
// )
// });


router.post('/set-deadline', function (req, res, next) {
    let dateObj = req.body 
    
    Board.findOneAndUpdate({ _id: dateObj.idBoard },
        {
            $set: {
                ['lists.' + dateObj.indexList + '.cards.' + dateObj.indexCard + '.deadline']: dateObj.date,
            }
        },
        {
            upsert: true
        },
        ((err, updated) => {
            if(err) { console.log(err) }
            else { res.status(200).send('Added'); }
        })
    )
  });



module.exports = router;
