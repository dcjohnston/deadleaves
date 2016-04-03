var express = require('express'),
  // multer = require('multer'),
  fs = require('fs'),
  emojione = require('emojione'),
  path = require('path'),
  router = express.Router(),
  Parametrize = require('../image_utils/parametrize'),
  PythonShell = require('python-shell'),
  ScaleImage = require('../image_utils/scale_svg');
  // upload = multer({
  //   dest: 'uploads/'
  // })

emojione.imageType = 'svg';

router.post('/task', function(req, res, next) {
  var post = req.body,
    emojis = emojione.unicodeToImage(post.emoji),
    emojishorts = emojione.toShort(post.emoji).split('::'),
    alpha = post.intensity,
    emojiIds = emojis.match(/(?:\/([a-z, 0-9]*\.svg))/g);

  var cliArguments = {
    mode: '',
    scriptPath: path.join(__dirname, '../python_scripts',

  }

  PythonShell.run('emojify.py', cliArguments, function (err, results) {
    if (err) {
      throw err;
    } else {
      //encoding binary -> utf-8 string
      var processedImage = fs.readFile(results, function (err, data) {
        var base64data = new Buffer(data).toString('base64');
        res.header({
            'Content-Type': 'application/json'
          })
          .send({
            image: base64data,
            name: 'emoji_pile.png'
          });
      });

    }
  });

});

module.exports = router;
