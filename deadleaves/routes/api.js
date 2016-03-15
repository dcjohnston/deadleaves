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
      emojiShorts = emojione.toShort(post.emoji).split('::'),
      emojiId = emojis.match(/(.*\/assets\/svg\/([a-z, 0-9]*\.svg).*)+/)[2],
      targetSvg = path.join(__dirname, '../node_modules/emojione/assets/svg', emojiId),
      targetImage = path.join(__dirname, '../uploads', image.filename),
      xyMap = Locations(emojiShorts);

  var emojis = Svg.fromSvgDocument(targetSvg, function (e, svg) {
    
  });

});

module.exports = router;
