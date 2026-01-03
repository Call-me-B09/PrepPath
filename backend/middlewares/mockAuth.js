module.exports = (req, res, next) => {
  // TEMP: simulate Firebase UID
  req.uid = "test-firebase-uid-123";
  next();
};
