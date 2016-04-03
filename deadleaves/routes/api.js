var express = require('express'),
  // multer = require('multer'),
  fs = require('fs'),
  emojione = require('emojione'),
  path = require('path'),
  router = express.Router(),
  Parametrize = require('../image_utils/parametrize'),
  PythonShell = require('python-shell'),
  pn = require('pn'),
  svg2png = require('svg2png'),
  ScaleImage = require('../image_utils/scale_svg');

emojione.imageType = 'svg';

router.post('/task', function(req, res, next) {
  var post = req.body,
    emojis = emojione.unicodeToImage(post.emoji),
    emojishorts = emojione.toShort(post.emoji).split('::'),
    alpha = post.intensity,
    emojiIds = emojis.match(/(?:\/([a-z, 0-9]*\.svg))/g);

  var cliArguments = {
    mode: 'text',
    scriptPath: path.join(__dirname, '../python_scripts'),
  };

  PythonShell.run('emojify.py', cliArguments, function(err, results) {
    //encoding binary -> utf-8 string
    pn.readFile(results)
      .then(svg2png)
      .then(function(buffer) {
        var base64data = buffer.toString('base64');
        res.header({
            'Content-Type': 'application/json'
          })
          .send({
            image: base64data,
            name: 'emoji_pile.png'
          });
      });
  });
});

module.exports = router;
