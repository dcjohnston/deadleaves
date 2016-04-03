var Svg = require('svgutils').Svg,
    Matrix = require('svgutils').Matrix;

module.exports = function (uri, scalingFactor, cb) {
  Svg.fromSvgDocument(uri, function (err, svg) {
    // svg.elements.map(function (e) {
    //   e.transform = 'scale(' + scalingFactor + ')';
    // });
    // cb(svg);
    console.log(svg.applyMatrix);
    svg.applyMatrix(null, function(newSvg){
      console.log(newSvg.toString());
    });
  });
}
