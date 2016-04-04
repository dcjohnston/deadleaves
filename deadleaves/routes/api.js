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
    outputDir = path.join(__dirname, '../out');

  var cliArguments = {
    mode: 'text',
    scriptPath: path.join(__dirname, '../python'),
    args: ['-i', alpha, '-e'].concat(emojiIds).concat(['-o', 'out', outputDir, 'size 128 128'])
  };

  PythonShell.run('makeSVG.py', cliArguments, function(err, results) {
    fs.readFile(results[0], function(e, d) {
      console.log("converting", d.length);
      res.header({
          'Content-Type': 'application/json',
        })
        .send({
          'preview': path.basename(results[0])
        });
      // svg2png(d, {
      //     width: 128,
      //     height: 128
      //   })
      //   .then(function(e, d) {
      //     var target = path.join(__dirname, '../out', path.basename(results[0]).replace('.svg', '.png'));
      //     fs.createWriteStream(target)
      //       .write(d)
      //       end();
      //     res.header({
      //         'Content-Type': 'application/json',
      //       })
      //       .send({
      //         'preview': path.basename(target)
      //       });
      //   })
    });
  });
});

module.exports = router;
