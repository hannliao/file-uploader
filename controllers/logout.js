exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie('connect.sid');
      res.setHeader('Cache-Control', 'no-store');
      res.redirect('/login');
    });
  });
};
