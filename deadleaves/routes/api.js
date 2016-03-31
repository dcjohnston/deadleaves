var express = require('express'),
    multer = require('multer'),
    emojione = require('emojione'),
    path = require('path'),
    router = express.Router(),
    Locations = require('../image_utils/image'),
    Svg = require('svgutils').Svg,
    upload = multer({
      dest: 'uploads/'
    })

emojione.imageType = 'svg';

router.post('/task', upload.single('image'), function (req, res, next){
  var post = req.body,
      image = req.file,
      emojis = emojione.unicodeToImage(post.emoji),
      emojishorts = emojione.toShort(post.emoji).split('::'),
      alpha = post.intensity,
      emojiIds = emojis.match(/(?:\/([a-z, 0-9]*\.svg))/g),
      targetimage = path.join(__dirname, '../uploads', image.filename),
      xymap = Locations(emojishorts.length, alpha);

  var targetSvgs = emojiIds.map(function(name) {
    return path.join(__dirname, '../node_modules/emojione/assets/svg', name);
  });

  console.log(xymap);

  //
  // var emojis = Svg.fromSvgDocument(targetSvg, function (e, svg) {
  //
  // });

});

module.exports = router;
