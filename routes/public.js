const express = require('express');
const AppRelease = require('../models/AppRelease');
const { formatBytes, formatDate } = require('../utils/format');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const apps = await AppRelease.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .lean();

    res.render('index', {
      title: 'SineQ - APK İndirme Merkezi',
      apps,
      formatBytes,
      formatDate
    });
  } catch (err) {
    next(err);
  }
});

router.get('/app/:slug', async (req, res, next) => {
  try {
    const app = await AppRelease.findOne({ slug: req.params.slug, status: 'published' }).lean();
    if (!app) return res.status(404).render('404', { title: 'Uygulama bulunamadı' });

    res.render('app-detail', {
      title: `${app.appName} ${app.version} indir`,
      app,
      formatBytes,
      formatDate
    });
  } catch (err) {
    next(err);
  }
});

router.get('/download/:id', async (req, res, next) => {
  try {
    const app = await AppRelease.findOneAndUpdate(
      { _id: req.params.id, status: 'published' },
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!app) return res.status(404).render('404', { title: 'Dosya bulunamadı' });

    return res.redirect(app.apkPath);
  } catch (err) {
    next(err);
  }
});

router.get('/privacy', (req, res) => res.render('static-page', {
  title: 'Gizlilik Politikası',
  heading: 'Gizlilik Politikası',
  body: [
    'SineQ, ziyaretçilerin gizliliğine önem verir. Bu sitede uygulama indirme işlemlerini güvenli şekilde sunmak için temel teknik kayıtlar tutulabilir.',
    'İndirme sayacı için uygulama bazlı indirme adedi saklanır. Bu sayaç kişisel profil oluşturmak amacıyla kullanılmaz.',
    'Admin paneline erişim şifreli oturum sistemiyle korunur. Şifreler düz metin olarak saklanmaz; hashlenmiş şekilde tutulur.'
  ]
}));

router.get('/terms', (req, res) => res.render('static-page', {
  title: 'Kullanım Şartları',
  heading: 'Kullanım Şartları',
  body: [
    'Bu sitede yayınlanan APK dosyalarını indirerek cihaz güvenliğinden ve kullanım kararından kendiniz sorumlu olduğunuzu kabul edersiniz.',
    'SineQ üzerinde yalnızca yayınlama hakkı bulunan, izinli veya geliştiricisi tarafından paylaşılmasına izin verilen uygulamalar yayınlanmalıdır.',
    'Kötü amaçlı yazılım, telif ihlali, yasa dışı içerik veya kullanıcı güvenliğini riske atan dosyalar yayınlanmamalıdır.'
  ]
}));

router.get('/contact', (req, res) => res.render('static-page', {
  title: 'İletişim',
  heading: 'İletişim',
  body: [
    'SineQ ile iletişime geçmek için Instagram hesabımız üzerinden mesaj gönderebilirsiniz.',
    'Instagram: @qasimflix',
    'İçerik, uygulama kaldırma, teknik sorun veya iş birliği talepleri için mesajınızda detaylı bilgi vermeniz önerilir.'
  ]
}));

router.get('/takedown', (req, res) => res.render('static-page', {
  title: 'İçerik Kaldırma',
  heading: 'İçerik Kaldırma',
  body: [
    'Bir uygulamanın izinsiz yayınlandığını düşünüyorsanız, kaldırma talebi gönderebilirsiniz.',
    'Talepte uygulama adı, ihlal sebebi, hak sahipliği açıklaması ve iletişim bilgileri yer almalıdır.',
    'Geçerli talepler incelendikten sonra ilgili APK yayından kaldırılabilir.'
  ]
}));

module.exports = router;
