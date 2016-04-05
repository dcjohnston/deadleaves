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

router.post('/generate', function(req, res, next) {
  var post = req.body,
    emojis = emojione.unicodeToImage(post.emoji),
    emojishorts = emojione.toShort(post.emoji).split('::'),
    alpha = post.intensity,
    size = parseInt(post.size),
    emojiIds = emojis.match(/(?:\/([a-z, 0-9]*\.svg))/g).map(function(id) {
      return path.join(__dirname, '../node_modules/emojione/assets/svg', id);
    }),
    outputDir = path.join(__dirname, '../out');

  if (!post.intensity || (size > 1024) || !emojishorts.length) {
    next({
      status: 400,
      message: 'Invalid Request'
    });
  }

  var cliArguments = {
    mode: 'text',
    scriptPath: path.join(__dirname, '../python'),
    args: ['-i', alpha, '-e'].concat(emojiIds).concat(['-o', 'out', outputDir, 'size ', size, ' ', size])
  };

  PythonShell.run('makeSVG.py', cliArguments, function(err, results) {
    res
      .status(201)
      .header({
        'Content-Type': 'application/json',
      })
      .send({
        'target': path.basename(results[0]),
        'size': size
      });
  });
});

router.post('/rasterize', function(req, res, next) {
  var target = path.join(__dirname, '../out', req.body.target);
  var size = parseInt(req.body.size);
  if (path.extname(target) !== '.svg' || size > 1024) {
    next({
      status: 400,
      message: "Invalid Request"
    })
  }
  fs.readFile(target, function(e, d) {
    if (e) {
      next({
        status: 500,
        message: "Something went wrong"
      });
    }
    svg2png(d, {
        width: size,
        height: size
      })
      .then(function(buffer) {
        res.header({
            'Content-Type': 'application/json',
          })
          .send({
            'encodedUri': 'data:image/png;base64,' + buffer.toString('base64'),
            'name': path.basename(target).replace('.svg', '')
          });
        fs.unlink(req.target);
      })
  });
});

module.exports = router;
