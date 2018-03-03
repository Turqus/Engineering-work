var express = require('express');
var router = express.Router();

var Board = require('../model/board.model');

router

    .post('/to-comment', (req, res) => {
        Board.updateBoard(req.body)
            .then(resp => {
                let respond = resp;
                res.json(respond);
            })
    })
    .post('/to-add-lists', (req, res) => {
        Board.updateBoard(req.body)
            .then(resp => {
                let respond = resp;
                res.json(respond);
            })
    })
    .post('/to-add-cards', (req, res) => {
        Board.updateBoard(req.body)
            .then(resp => {
                let respond = resp;
                res.json(respond);
            })
    })
    .post('/to-adding-people-to-the-board', (req, res) => {
        Board.updateBoard(req.body)
            .then(resp => {
                let respond = resp;
                res.json(respond);
            })
    })
    .post('/to-adding-people-to-the-cards', (req, res) => {
        Board.updateBoard(req.body)
            .then(resp => {
                let respond = resp;
                res.json(respond);
            })
    })
    .post('/to-the-visibility-of-the-board', (req, res) => {
        Board.updateBoard(req.body)
            .then(resp => {
                let respond = resp;
                res.json(respond);
            })
    });


module.exports = router;



