module.exports = {
  async get(req, res) {
    if (!req.user) return res.redirect('/login');
    res.redirect(`/folders/1`);
  },
};
