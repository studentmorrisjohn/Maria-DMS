require('dotenv').config()
var express = require('express');
var router = express.Router();
var db = require('./db.js');
var $ = require('jquery');

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', {});
});

module.exports = router;
