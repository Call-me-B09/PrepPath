module.exports = (req, res, next) => {
  // TEMP: simulate Firebase UID
  console.log(`[MockAuth] Request: ${req.method} ${req.url} - Assigning default UID`);
  req.uid = "test-firebase-uid-123";
  next();
};
