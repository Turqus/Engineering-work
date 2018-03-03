var express = require('express');
var router = express.Router();
var Board = require('../model/board.model');
var User = require('../model/user.model');

router

.get('/boards-list', function (req, res) {
  Board.find({ 'users': req.user._id })
    .then((board) => {
      res.json(board);
    })
    .catch((err) => {
      res.status(404).json('Nie można pobrać tablic.')
    })
})

.get('/boards', function (req, res) {
  res.render('boards', { user: req.user, title: 'Twoje Tablice' });
})

.get('/b/:id', function (req, res) {
  Board.findById(req.params.id)
    .then((board) => {
      return res.render('board', { title: 'Tablica', board: board });
    })
    .catch((err) => {
      console.log(err)
    })
})


module.exports = router;
