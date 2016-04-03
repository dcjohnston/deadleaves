var express = require('express'),
    multer = require('multer'),
    fs = require('fs'),
    emojione = require('emojione'),
    path = require('path'),
    router = express.Router(),
    Parametrize = require('../image_utils/parametrize'),
    ScaleImage = require('../image_utils/scale_svg'),
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
      xymap = Parametrize(emojishorts.length, alpha);

  // //transform emoji index into url to upstream svg
  xymap = xymap.map(function (parameters) {
    var eName = emojiIds[parameters[3]];
    parameters[3] = path.join(__dirname, '../node_modules/emojione/assets/svg', eName);
    return parameters;
  })

  //.map(function (parameters) {
  //   ScaleImage(parameters[3], parameters[2], function (svg) {
  //     console.log(svg);
  //   });
  // });

  var image = fs.readFileSync(targetimage);
  var base64data = new Buffer(image).toString('base64');
  //encoding binary -> utf-8 string
  res.send(base64data);
  // var emojis = Svg.fromSvgDocument(targetSvg, function (e, svg) {
  //
  // });

});

module.exports = router;
