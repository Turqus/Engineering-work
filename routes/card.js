var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var multer = require('multer');
var Board = require('../model/board.model');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension);

    }
})


const upload = multer({ storage: storage })



router.post('/upload-attachment', upload.any(), function (req, res, next) {
    res.send(req.files);
});




router.put('/transfer-card', (req, res) => {
    let transferObj = req.body; 

    if (transferObj.toBoard != undefined) {
        Board.findOneAndUpdate({ _id: transferObj.idBoard },
            { $set: { ['lists.' + transferObj.fromIndexList + '.cards']: transferObj.fromCards, } }, { upsert: true })
            .then(() => { 
                Board.findOneAndUpdate({ _id: transferObj.toBoard },
                    { $set: { ['lists.' + transferObj.toList + '.cards']: transferObj.toCards, } }, { upsert: true },
                    ((err, updated) => {
                        if (err) { console.log(err) }
                        else { res.status(200).send('Transfered'); }
                    })
                );
            })

    } else {
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
                else { res.status(200).send('Deleted'); }
            })
        )
    }
});


router.post('/delete-card', (req, res) => {
    let deleteObj = req.body;

    Board.findOneAndUpdate({ _id: deleteObj.idBoard },
        {
            $set: {
                ['lists.' + deleteObj.indexList + '.cards']: deleteObj.lists,
            }
        },
        {
            upsert: true
        },
        ((err, updated) => {
            if (err) { console.log(err) }
            else { res.status(200).send('Deleted'); }
        })
    )
});


router.post('/set-deadline', function (req, res, next) {
    let dateObj = req.body;

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
            if (err) { console.log(err) }
            else { res.status(200).send('Added'); }
        })
    )
});



router.put('/copy-card', (req, res) => { 
    let copyCardObj = req.body;

    Board.findOneAndUpdate({ _id: copyCardObj.idBoard },
        {
            $set: {
               lists: copyCardObj.lists,
            }
        },
        {
            upsert: true
        },
        ((err, updated) => {
            if (err) { console.log(err) }
            else { res.status(200).send('Added'); }
        })
    )

});

module.exports = router;
