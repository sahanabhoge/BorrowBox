// Blocks the request unless the user has logged in (session contains userId)
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Please log in first" });
  }
  next();
}

module.exports = requireLogin;
