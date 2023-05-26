require('dotenv').config()
var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");

var db = require('./db.js');
var $ = require('jquery');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

function noCache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('testdata', { title: 'Express' });
});

router.get('/viewData', function(req, res, next) {

  db.getAllData().then((ducks) => {
    res.render('viewdata',
        {
          title: 'Express',
          something: ducks,
          cookies: req.cookies
        });
  });

});

router.get('/socketTest', function(req, res, next) {

  res.render('socketTest', {});

});

router.post('/addData', function (req, res) {
  let {payload, topic}  = req.body;

  console.log(payload);
  console.log(topic);

  var message = db.insertToClusterData("TEST_DUCK_ID", topic, 'TEST_MESSAGE_ID', payload, 'TEST_PATH', 1, 1);

  // var message = "successfully added to the database";

  res.json({"message": message});

});


router.get('/getCoordinates', noCache, function (req, res, next) {
  db.getAllRescueesLocation().then((response) => {
    //console.log(response["payload"]);
    
    res.json(response);

  });
});

router.get('/getDetails', noCache, function (req, res, next) {
  const clientId = req.query.clientId;

  try {
    db.getRescueeDetail(clientId).then((response) => {
      //console.log(response["payload"]);
      
      res.json(response);
  
    });
  }
  catch (error) {
    res.json({"error":error});
  }
  
});



module.exports = router;