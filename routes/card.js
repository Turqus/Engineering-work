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
    console.log(req.body,  req.files)
    res.send(req.files);
});



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
            if (err) { console.log(err) }
            else { res.status(200).send('Added'); }
        })
    )
});



module.exports = router;
