function InversePowerCDF(alpha, xmin) {
  xmin = xmin || 10; //lol
  if (typeof alpha === "function") {
    alpha = alpha();
  }
  return function(p) {
    return alpha*xmin*Math.pow(p, -1/(alpha + 1));
  };
}

module.exports = function (emojiArray) {
  return {
    locations: emojiArray.map(function (e) {
      return [Math.random(), Math.random(), InversePowerCDF(Math.random)(Math.random())];
    })
  };
};
