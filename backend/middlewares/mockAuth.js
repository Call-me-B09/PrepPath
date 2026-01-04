module.exports = (req, res, next) => {
  const headerUid = req.headers['x-auth-uid'];
  if (headerUid) {
    req.uid = headerUid;
  } else {
    // Fallback for testing/dev if needed, or remove
    console.log(`[MockAuth] No x-auth-uid header, defaulting to test UID`);
    req.uid = "test-firebase-uid-123";
  }
  next();
};
