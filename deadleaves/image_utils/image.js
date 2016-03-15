function InversePowerCDF(alpha, xmin) {
  xmin = xmin || 10; //lol
  if (typeof alpha === "function") {
    alpha = alpha();
  }
  return function(p) {
    return Math.pow(alpha*xmin*Math.pow(p, -1/(alpha + 1)));
  };
}

module.exports = function (emojiArray) {
  return {
    scales: emojiArray.map(InversePowerCDF(Math.random)),
    locations: emojiArray.map(function (e) {
      return [Math.random(), Math.random()];
    })
  };
};
