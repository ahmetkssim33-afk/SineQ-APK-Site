const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');
const { redirectIfLoggedIn } = require('../middleware/auth');
const { createAdminToken, cookieOptions } = require('../utils/authToken');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Çok fazla giriş denemesi yaptınız. Lütfen biraz sonra tekrar deneyin.'
});

router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('admin/login', { title: 'Admin Giriş', error: null });
});

router.post('/login', loginLimiter, redirectIfLoggedIn, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: String(username || '').trim() });

    if (!admin) {
      return res.status(401).render('admin/login', { title: 'Admin Giriş', error: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const ok = await bcrypt.compare(String(password || ''), admin.passwordHash);
    if (!ok) {
      return res.status(401).render('admin/login', { title: 'Admin Giriş', error: 'Kullanıcı adı veya şifre hatalı.' });
    }

    res.cookie('sineq_admin', createAdminToken(admin), cookieOptions());
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('sineq_admin', { path: '/' });
  res.redirect('/admin/login');
});

module.exports = router;
