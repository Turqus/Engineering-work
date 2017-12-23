var express = require('express');
var router = express.Router();

var User = require('../model/user.model');


router.post('/update/information', function (req, res) {
    var add = req.body;

    User.findOneAndUpdate({ _id: add._id },
        {
            $set: {
                firstName: add.firstName,
                surname: add.surname, 
                initials: add.initials,
                biography: add.biography
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

router.post('/update/personal/information', function (req, res) {
    var add = req.body;

    User.findOneAndUpdate({ _id: add._id },
        {
            $set: {
                firstName: add.firstName,
                surname: add.surname, 
                country: add.country,
                city: add.city,
                phone: add.phone
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


module.exports = router;
