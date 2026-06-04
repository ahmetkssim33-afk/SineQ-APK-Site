function requireAdmin(req, res, next) {
  if (req.admin && req.admin.id) {
    return next();
  }
  return res.redirect('/admin/login');
}

function redirectIfLoggedIn(req, res, next) {
  if (req.admin && req.admin.id) {
    return res.redirect('/admin');
  }
  return next();
}

module.exports = { requireAdmin, redirectIfLoggedIn };
