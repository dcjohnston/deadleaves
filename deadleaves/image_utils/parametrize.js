function InversePowerCDF(alpha, xmin) {
  xmin = xmin || .1; //lol
  if (typeof alpha === "function") {
    alpha = alpha();
  }
  return function(p) {
    return alpha*xmin*Math.pow(p, -1/(alpha + 1));
  };
}

module.exports = function (emojiClassCount, alpha) {
  var positions = [],
      emojiCount = Math.pow(alpha,-1)*Math.pow(10,2.6987);

  for (var i = 0; i < emojiCount; i++) {
    //x, y, scaling factor, emoji index
    positions.push([
      Math.random(),
      Math.random(),
      InversePowerCDF(alpha)(Math.random()),
      Math.floor(Math.random()*emojiClassCount)
    ]);
  }
  return positions;
};
