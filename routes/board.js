var express = require('express');
var router = express.Router();
var Board = require('../model/board.model');
var User = require('../model/user.model');

router

    .post('/copy-list', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        lists: rb.lists,
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            });
    })
    .post('/copy-board', function (req, res, next) {
        var newBoard = req.body;
        var board = new Board(newBoard);

        board.save()
            .then(function (boards) {
                res.send(boards);
            })
            .catch((err) => {
                console.log(err)
            })
    })
    .put('/change/background', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        background: rb.background,
                        image: null
                    },
                    $push: {
                        activity: { $each: [rb.activity], $position: 0 }
                    },
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            });

    })
    .put('/changePhoto', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        background: null,
                        image: rb.namePhoto
                    },
                    $push: {
                        activity: { $each: [rb.activity], $position: 0 }
                    },
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            });
    })
    .post('/toggle-board', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        closed: rb.closed
                    }
                },
                idBoard: rb.idBoard
            };


        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            });
    })
    .post('/transfer-list', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {}
                },
                idBoard: rb.idBoard
            };

        if (rb.isSame === true) obj.query.$set.lists = rb.lists;
        else obj.query.$set.lists = rb.updatedList;
        Board.updateBoard(obj)
            .then(resp => {
                if (rb.isSame === true) {
                    res.json(resp);
                } else {
                    obj = {
                        query: {
                            $set: {
                                lists: rb.lists
                            }
                        },
                        idBoard: rb.toBoard
                    };


                    Board.updateBoard(obj)
                        .then(resp => {
                            res.json(resp);
                        });
                }
            })
    })
    .post('/find-member', (req, res) => {
        var textSearch = req.body.keyWord;
        var users = req.body.users;
        var query = {};

        query.$or = [
            { username: { $regex: '.*' + textSearch + '.*' } },
            { firstName: { $regex: '.*' + textSearch + '.*' } },
            { surname: { $regex: '.*' + textSearch + '.*' } },
            { email: { $regex: '.*' + textSearch + '.*' } }
        ];

        if (textSearch.length > 0) {
            User.find(query)
                .then((result) => {
                    var existed = false;
                    var filtredResult = [];

                    if (users.length == 0) {
                        filtredResult = result;

                    } else {
                        for (var i = 0; i < result.length; i++) {

                            existed = false;

                            for (var j = 0; j < users.length; j++) {
                                if (result[i]._id == users[j]) {
                                    existed = true;
                                }
                            }
                            if (existed === false) {
                                filtredResult.push(result[i]);
                            }
                        }
                    }
                    res.json(filtredResult);
                })
        }
    })
    .get('/load-members', (req, res) => {
        User.find({ _id: req.query.members })
            .then((members) => {
                res.json(members);
            })
    })
    .post('/load-members-to-add-card', (req, res) => {
        var obj = req.body.membersObj;

        Board.findById({ _id: obj.idBoard })
            .then((board) => {
                var existed = false;
                var filtredResult = [];

                if (obj.members.length == 0) {
                    filtredResult = board.users;
                } else {
                    for (var i = 0; i < board.users.length; i++) {
                        existed = false;
                        for (var j = 0; j < obj.members.length; j++) {
                            if (board.users[i] == obj.members[j]) {
                                existed = true;
                            }
                        }
                        if (existed === false) {
                            filtredResult.push(board.users[i]);
                        }
                    }
                }

                User.find({ _id: filtredResult })
                    .then((members) => {
                        res.json(members);
                    })
            });
    })
    .post('/delete-member-with-board', (req, res) => {
        Board.find({ _id: req.body.idBoard })
            .then((finded) => {
                var rb = req.body;
                let filtredResult = finded[0].users.filter((member, index) => member != rb.idMember);

                var obj = {
                    query: {
                        $set: {
                            users: filtredResult
                        }
                    },
                    idBoard: rb.idBoard
                };

                Board.updateBoard(obj)
                    .then(resp => {
                        User.findOneAndUpdate({ _id: req.body.newMember },
                            {
                                "$set": { "notifications.readed": false },
                                "$push": { "notifications.note": { $each: [rb.notification], $position: 0 } },
                            },
                            {
                                upsert: true
                            },
                            ((cards) => {
                                res.status(200).send('updated');
                            })
                        )
                    })
            })
    })
    .post('/delete-member-with-card', (req, res) => {
        var rb = req.body;

        Board.findById({ _id: req.body.idBoard })
            .then((finded) => {
                let filtredResult = finded.lists[req.body.indexList].cards[req.body.indexCard].members.filter((member, index) => member != req.body.userID);
                var obj = {
                    query: {
                        $set: {
                            ['lists.' + req.body.indexList + '.cards.' + req.body.indexCard + '.members']: filtredResult
                        }
                    },
                    idBoard: rb.idBoard
                };

                Board.updateBoard(obj)
                    .then(resp => {
                        res.json(resp);
                    })
            })
    })
    .post('/add-member-to-card', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + req.body.indexList + '.cards.' + req.body.indexCard + '.members']: rb.members
                    },
                    $push: {
                        "activity": { $each: [rb.activity], $position: 0 }
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                User.findById({ _id: req.body.member })
                    .then((user) => {
                        User.findOneAndUpdate({ _id: req.user._id },
                            {
                                "$push": { "activity": { $each: [{ 'information': 'Przypisałeś użytkownika ' + user.username + ' do karty ' + resp.lists[req.body.indexList].cards[req.body.indexCard].name, 'date': new Date() }], $position: 0 } },
                            },
                            {
                                upsert: true
                            },
                            ((err, user) => {
                                res.status(201).send('Zaktualizowano.');
                            })
                        )
                    })
            });
    })
    .post('/load-members-card', (req, res) => {
        var obj = req.body.membersObj;

        Board.findById({ _id: obj.idBoard })
            .then((board) => {
                let filtredResult = board.lists[obj.indexList].cards[obj.indexCard].members;

                User.find({ _id: filtredResult })
                    .then((members) => {
                        res.json(members);
                    })
            })
    })
    .post('/archive-list', (req, res) => {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        "archives": rb.archives,
                        "lists": rb.lists
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            });
    })
    .post('/label/delete', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        boardLabels: rb.boardLabels,
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })

    })



    .post('/add/comment', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        lists: rb.lists
                    },
                    $push: {
                        activity: { $each: [rb.activity], $position: 0 }
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                User.findOneAndUpdate({ _id: req.user._id },
                    {
                        "$push": { "activity": { $each: [{ 'information': 'Utworzyłeś komentarz do karty ' + rb.cardName, 'date': new Date() }], $position: 0 } },
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

    .post('/edit-comment', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.comments.' + rb.indexComment + '.text']: rb.text
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                let respond = resp;
                res.json(respond);
            })
    })


    .post('/delete-comment', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        ['lists.' + rb.indexList + '.cards.' + rb.indexCard + '.comments']: rb.comments
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })


    .post('/create/lists', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        lists: rb.lists
                    },
                    $push: {
                        activity: { $each: [rb.activity], $position: 0 }
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            })
    })
    .post('/create/board', function (req, res) {
        var newBoard = {
            name: req.body.name,
            closed: false,
            image: null,
            background: '#0079BF',
            lists: [],
            activity: [],
            archives: [],
            cardArchive: [],
            users: [req.user._id],

            permissions: {
                addingComments: true,
                addingLists: true,
                addingCards: true,
                addingPeopleToTheBoard: true,
                addingPeopleToTheCards: true,
                theVisibilityOfTheBoard: true
            },

            boardLabels: [
                {
                    "colour": "#61BD4F",
                    "name": "green"
                },
                {
                    "colour": "#F2D600",
                    "name": "yellow"
                },
                {
                    "colour": "#FFAB4A",
                    "name": "orange"
                },
                {
                    "colour": "#C377E0",
                    "name": "pink"
                }
            ]
        }

        var board = new Board(newBoard);

        board.save()
            .then(function (boards) {
                User.findOneAndUpdate({ _id: req.user._id },
                    { "$push": { "activity": { $each: [{ 'information': 'Utworzyłeś tablicę o nazwie ' + req.body.name, 'date': new Date() }], $position: 0 } }, },
                    { upsert: true },
                    ((err, newBoard) => {
                        if (err) throw err;
                        else res.send(boards);
                    })
                )
            })
            .catch((err) => {
                console.log(err)
            })
    })




    .post('/add/label/board', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: {
                        boardLabels: rb.labels
                    }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                res.json(resp);
            });
    })


    .post('/add/member/board', function (req, res) {
        var rb = req.body,
            obj = {
                query: {
                    $set: { users: rb.users },
                    $push: {  activity: { $each: [rb.activity], $position: 0 }  }
                },
                idBoard: rb.idBoard
            };

        Board.updateBoard(obj)
            .then(resp => {
                User.findOneAndUpdate({ _id: req.body.newMember },
                    {  "$set": { "notifications.readed": false },
                        "$push": { "notifications.note": { $each: [rb.notification], $position: 0 } }, },
                    { upsert: true },
                    ((err, member) => {
                        User.findOneAndUpdate({ _id: req.user._id },
                            {  "$push": { "activity": { $each: [{ 'information': 'Dodałeś nowego członka ' + member.username + ' do tablicy ' + resp.name, 'date': new Date() }], $position: 0 } }, },
                            { upsert: true },
                            ((err, user) => { res.json('Użytkownik został dodany do tablicy.'); })
                        )
                    }))
            })
    })





    .get('/selected/board', function (req, res) {
        Board.findById({ _id: req.query._id })
            .then((board) => {
                res.json(board);
            })
            .catch((err) => {
                res.status(404).json('Nie można pobrać danej tablicy.')
            })
    })




module.exports = router;
