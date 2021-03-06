var express = require('express'),
  // multer = require('multer'),
  fs = require('fs'),
  emojione = require('emojione'),
  path = require('path'),
  router = express.Router(),
  PythonShell = require('python-shell'),
  Rsvg = require('librsvg').Rsvg;

emojione.imageType = 'svg';

router.post('/generate', function(req, res, next) {
  var post = req.body,
    emojis = emojione.unicodeToImage(post.emoji),
    emojishorts = emojione.toShort(post.emoji).split('::'),
    alpha = parseFloat(post.intensity),
    sizes = post.size.match(/(\d+)x(\d+)/),
    color = post.backgroundColor,
    emojiIds = emojis.match(/(?:\/([a-z, 0-9]*\.svg))/g).map(function(id) {
      return path.join(__dirname, '../node_modules/emojione/assets/svg', id);
    }),
    outputDir = path.join(__dirname, '../out');

  var width = parseInt(sizes[1]);
  var height = parseInt(sizes[2]);

  if ((!alpha || alpha < .05 || alpha> .5) || (Math.max(width, height) > 2000) || !emojishorts.length) {
    next({
      status: 400,
      message: 'Invalid Request'
    });
  }

  var cliArguments = {
    mode: 'text',
    scriptPath: path.join(__dirname, '../python'),
    args: ['-i', alpha, '-h', post.backgroundColor, '-e'].concat(emojiIds).concat(['-o', 'out', outputDir, 'size', width, height])
  };

  PythonShell.run('makeSVG.py', cliArguments, function(err, results) {
    if (err) {
      next({
        status: 500,
        message: err
      })
    } else {
      res
        .status(201)
        .header({
          'Content-Type': 'application/json',
        })
        .send({
          'target': path.basename(results[0]),
          'width': width,
          'height': height
        });
    }
  });
});

router.post('/rasterize', function(req, res, next) {
  var target = path.join(__dirname, '../out', req.body.target.replace(/g\//i, ''));
  var width = parseInt(req.body.width);
  var height = parseInt(req.body.height);
  if (path.extname(target) !== '.svg' || Math.max(width, height) > 2000) {
    next({
      status: 400,
      message: "Invalid Request"
    })
  }
  var svg = new Rsvg();
  svg.on('finish', function () {
    var buffer = svg.render({
      format: 'png',
      width: width,
      height: height
    }).data
    res.header({
        'Content-Type': 'application/json',
      })
    .send({
      'encodedUri': 'data:image/png;base64,' + buffer.toString('base64'),
      'name': path.basename(target).replace('.svg', '')
    });
    fs.unlink(target)
  })
  fs.createReadStream(target).pipe(svg);
});

module.exports = router;
