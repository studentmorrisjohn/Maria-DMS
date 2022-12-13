var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('map', 
    {
        locations: [[14.150273, 121.212752], [14.141438, 121.204444]]
    });
});

module.exports = router;
