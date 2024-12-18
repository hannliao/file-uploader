const { validationResult } = require('express-validator');
const passport = require('passport');

exports.loginGet = (req, res) => {
  res.render('login', { appName: 'clouddrive', title: 'Log In', errors: [] });
};

exports.loginPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('login', {
      appName: 'clouddrive',
      title: 'Log In',
      errors: errors.array(),
      username: req.body.username,
    });
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).render('login', {
        appName: 'clouddrive',
        title: 'Log In',
        errors: [{ msg: info.message }],
        username: req.body.username,
      });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).send('Login failed');
      }
      return res.redirect(`/`);
    });
  })(req, res, next);
};
