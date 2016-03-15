var express = require('express');
var multer = require('multer');
var emojione = require('emojione')
var fs = require('fs');
var path = require('path');
var router = express.Router();
var imageUtils = require('../image_utils/image')
var upload = multer({
  dest: 'uploads/'
});

emojione.imageType = 'svg';

router.post('/task', upload.single('image'), function (req, res, next){
  var post = req.body,
      image = req.file,
      emoji = emojione.unicodeToImage(post.emoji),
      emojiId = emoji.match(/.*\/assets\/svg\/([a-z, 0-9]*\.svg).*/)[1],
      targetSvg = path.join(__dirname, '../node_modules/emojione/assets/svg', emojiId),
      targetImage = path.join(__dirname, '../uploads', image.filename)
      processorAPI = imageUtils(post.emoji.split(''));

  console.log(post, image);
});

module.exports = router;
