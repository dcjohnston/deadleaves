var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Emoji Piles'
  });
});

router.get('/about', function (req, res, next) {
  res.render('about', {
    title: 'Emoji Piles'
  })
});

router.get('/gallery', function (req, res, next) {

  fs.readdir(path.join(__dirname, '../public/images/gallery'), function (err, files) {
    res.render('gallery', {
      title: 'Emoji Piles',
      images: files
    });
  });
});

module.exports = router;
