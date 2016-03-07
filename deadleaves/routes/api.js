var express = require('express');
var router = express.Router();

router.post('/task', function (req, res, next){
  var POST = req.body;
  console.log(POST);
});

module.exports = router;
