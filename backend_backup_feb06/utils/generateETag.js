module.exports = function generateETag() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
};
