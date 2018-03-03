var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var Board = require('../model/board.model');

var multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        console.log(extArray)
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
    }
})
const upload = multer({ storage: storage })
router
    .post('/upload-attachment', upload.any(), function (req, res) {
        var rb = req.body,
            obj = {
                query: { $set: { ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.image']: req.files[0].filename } },
                idBoard: rb.idBoard
            };
        Board.updateBoard(obj)
            .then(resp => {
                res.redirect('/b/' + rb.idBoard);
            })
    })
    .post('/delete-list-tasks', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.listsTasks']: rb.listsTasks,
                    }
                },
                idBoard: rb.idBoard
            };


        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })
    .post('/delete-task', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.listsTasks.' + rb.indexListOfTasks + '.tasks']: rb.tasks,
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })
    .post('/send-back-list', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        lists: rb.lists,
                        archives: rb.archives
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })
    .post('/delete-card', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {}
                },
                idBoard: rb.idBoard
            };


        if (rb.cardArchive) obj.query.$set.cardArchive = rb.cardArchive
        else obj.query.$set = {
            ['lists.' + rb.indexList + '.cards']: rb.cards
        }

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })

    .post('/send-back-card', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {}
                },
                idBoard: rb.idBoard
            };

        if (rb.lists) {
            obj.query.$set = {
                lists: rb.lists,
                cardArchive: rb.cardArchive
            }
        } else if (rb.archives) {
            obj.query.$set = {
                archives: rb.archives,
                cardArchive: rb.cardArchive,
            }
        }
        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })
    .post('/archive-card', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        lists: rb.lists,
                        cardArchive: rb.cardArchive
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })







    .put('/transfer-card', (req, res) => {
        var rb = req.body,
            obj = {};

        if (rb.toBoard != undefined) {
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.fromIndexList + '.cards']: rb.fromCards,
                    }
                },
                idBoard: rb.idBoard
            };

            Board.updateBoard(obj)
                .then(resp => {
                    obj = {
                        query: {
                            $set: {
                                ['lists.' + rb.toList + '.cards']: rb.toCards
                            }
                        },
                        idBoard: rb.toBoard
                    };

                    Board.updateBoard(obj)
                        .then(resp => {
                            res.json('Przeniesiono.');
                        })
                })
        } else {
            obj = {
                query: {
                    $set: {
                        lists: rb.lists
                    }
                },
                idBoard: rb.idBoard
            };

            Board.updateBoard(obj)
                .then(resp => {
                    res.json(resp);
                })
        }
    })














    .post('/set-deadline', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.deadline']: rb.date
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })

    })
    .put('/copy-card', (req, res) => {
        var rb = req.body,
            obj = { query: { $set: {} } };

        if (!rb.selectedBoard) {
            obj.query.$set.lists = rb.lists;
            obj.query.idBoard = rb.idBoard;
        } else {
            obj.query.$set = { ['lists.' + rb.selectedList + '.cards']: rb.cards  };
            obj.query.idBoard = rb.selectedBoard;
        }
        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })

    .post('/delete-image-from-card', function (req, res) {
        let rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.image']: null
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })



    .post('/add/label/card', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.labels']: rb.labels
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            });
    })


    .post('/create/card', function (req, res) {

        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.cardIndex + '.cards']: rb.cards
                    },
                    $push: {
                        activity: { $each: [rb.activity], $position: 0 }
                    }
                },
                idBoard: rb.idBoard
            }

        Board.updateBoard(obj)
            .then(resp => {
                User.findOneAndUpdate({ _id: req.user._id },
                    {
                        "$push": { "activity": { $each: [{ 'information': 'Utworzyłeś kartę o nazwie ' + rb.name, 'date': new Date() }], $position: 0 } },
                    },
                    {
                        upsert: true
                    },
                    ((err, newBoard) => {
                        if (err) throw err;
                        else res.send(resp)
                    })
                )
            })
    })



    .post('/add/descrip/card', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.indexList + '.cards.' + rb.indexCard]: rb.descrip
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            });
    })



    .post('/add/lists/tasks', function (req, res) {
        var rb = req.body;
        obj = {
            query: { $set: {} },
            idBoard: rb.idBoard
        };

        if (rb.type == 'name') obj.query.$set = { ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.listsTasks']: rb.tasks }
        else if (rb.type == 'task') { obj.query.$set = { ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.listsTasks.' + rb.indexListOfTasks]: rb.tasks } }
        else obj.query.$set = { ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.listsTasks.' + rb.indexListOfTasks]: rb.status }

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })



    .put('/updatecards', function (req, res) { 
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        lists: rb.lists
                    }
                },
                idBoard: rb._id
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })

module.exports = router;
