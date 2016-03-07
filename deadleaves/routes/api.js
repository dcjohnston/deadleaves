var express = require('express');
var multer = require('multer');
var router = express.Router();
var upload = multer({ dest: 'uploads/'})
router.post('/task', upload.single('image'), function (req, res, next){
  var POST = req.body;
  var image = req.file;
  console.log(image);
});

module.exports = router;
