var express = require('express'),
  // multer = require('multer'),
  fs = require('fs'),
  emojione = require('emojione'),
  path = require('path'),
  router = express.Router(),
  Parametrize = require('../image_utils/parametrize'),
  PythonShell = require('python-shell'),
  svg2png = require('svg2png'),
  ScaleImage = require('../image_utils/scale_svg');

emojione.imageType = 'svg';

router.post('/task', function(req, res, next) {
  var post = req.body,
    emojis = emojione.unicodeToImage(post.emoji),
    emojishorts = emojione.toShort(post.emoji).split('::'),
    alpha = post.intensity,
    emojiIds = emojis.match(/(?:\/([a-z, 0-9]*\.svg))/g).map(function(id) {
      return path.join(__dirname, '../node_modules/emojione/assets/svg', id);
    }),
    outputDir = path.join(__dirname, '../output');

  var cliArguments = {
    mode: 'text',
    scriptPath: path.join(__dirname, '../python'),
    args: ['-i', alpha, '-e', emojiIds.join(' '), '-o', 'outDir', outputDir, 'size 512 512']
  };

  PythonShell.run('makeSVG.py', cliArguments, function(err, results) {
    //encoding binary -> utf-8 string
    fs.readFile(results[0], function(err, data) {
      var buffer = svg2png.sync(data);
      console.log(buffer);
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
