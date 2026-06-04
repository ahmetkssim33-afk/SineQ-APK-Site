const express = require('express');
const AppRelease = require('../models/AppRelease');
const { requireAdmin } = require('../middleware/auth');
const makeUniqueSlug = require('../utils/slug');
const { formatBytes, formatDate } = require('../utils/format');

const router = express.Router();

router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const apps = await AppRelease.find().sort({ createdAt: -1 }).lean();
    const totalDownloads = apps.reduce((sum, item) => sum + (item.downloadCount || 0), 0);
    const publishedCount = apps.filter(item => item.status === 'published').length;

    res.render('admin/dashboard', {
      title: 'Admin Paneli',
      apps,
      totalDownloads,
      publishedCount,
      formatBytes,
      formatDate,
      username: req.session.username
    });
  } catch (err) {
    next(err);
  }
});

router.get('/apps/new', (req, res) => {
  res.render('admin/new-app', { title: 'Yeni APK Yayınla', error: null, values: {} });
});

router.post('/apps', async (req, res, next) => {
  try {
    const {
      appName,
      description,
      version,
      changelog,
      status,
      logoUrl,
      apkUrl,
      apkOriginalName,
      apkSizeBytes
    } = req.body;

    if (!appName || !description || !version || !logoUrl || !apkUrl || !apkOriginalName || !apkSizeBytes) {
      return res.status(400).render('admin/new-app', {
        title: 'Yeni APK Yayınla',
        error: 'Uygulama adı, açıklama, sürüm, logo ve APK dosyası zorunludur.',
        values: req.body
      });
    }

    const slug = await makeUniqueSlug(appName, version);

    await AppRelease.create({
      appName: appName.trim(),
      description: description.trim(),
      version: version.trim(),
      changelog: String(changelog || '').trim(),
      status: status === 'draft' ? 'draft' : 'published',
      slug,
      logoPath: logoUrl,
      apkPath: apkUrl,
      apkOriginalName: String(apkOriginalName).trim(),
      apkSizeBytes: Number(apkSizeBytes) || 0
    });

    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

router.post('/apps/:id/status', async (req, res, next) => {
  try {
    const app = await AppRelease.findById(req.params.id);
    if (!app) return res.redirect('/admin');
    app.status = app.status === 'published' ? 'draft' : 'published';
    await app.save();
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

router.delete('/apps/:id', async (req, res, next) => {
  try {
    const app = await AppRelease.findByIdAndDelete(req.params.id);
    if (app) {
      try {
        const { del } = await import('@vercel/blob');
        await del([app.apkPath, app.logoPath]);
      } catch (blobErr) {
        console.warn('Blob silme uyarısı:', blobErr.message);
      }
    }
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
