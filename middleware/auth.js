const auth = (req, res, next) => {
  if (!req.user || !req.session || !req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};

module.exports = auth;
