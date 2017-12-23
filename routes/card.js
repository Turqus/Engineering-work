var express = require('express');
var router = express.Router();

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
 


module.exports = router;
