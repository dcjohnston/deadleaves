var express = require('express'),
  // multer = require('multer'),
  fs = require('fs'),
  emojione = require('emojione'),
  path = require('path'),
  router = express.Router(),
  Parametrize = require('../image_utils/parametrize'),
  PythonShell = require('python-shell'),
  svg2png = require('svg2png'),
  streamifier = require('streamifier'),
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
    outputDir = path.join(__dirname, '../out');

  var cliArguments = {
    mode: 'text',
    scriptPath: path.join(__dirname, '../python'),
    args: ['-i', alpha, '-e'].concat(emojiIds).concat(['-o', 'out', outputDir, 'size 128 128'])
  };

  PythonShell.run('makeSVG.py', cliArguments, function(err, results) {
    fs.readFile(results[0], function(e, d) {
      svg2png(d, {
          width: 512,
          height: 512
        })
        .then(function(buffer) {
          res.header({
              'Content-Type': 'application/json',
            })
            .send({
              'encodedUri': 'data:image/png;base64,' + buffer.toString('base64'),
              'name': path.basename(results[0]).replace('.svg', '')
            });
          fs.unlink(results[0]);
        })
    });
  });
});

module.exports = router;
