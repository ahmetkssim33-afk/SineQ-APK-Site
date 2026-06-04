const path = require('path');
const multer = require('multer');
const fs = require('fs');

const apkDir = path.join(__dirname, '..', 'uploads', 'apks');
const logoDir = path.join(__dirname, '..', 'uploads', 'logos');
fs.mkdirSync(apkDir, { recursive: true });
fs.mkdirSync(logoDir, { recursive: true });

function safeName(original) {
  const ext = path.extname(original).toLowerCase();
  const base = path.basename(original, ext).replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60);
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}${ext}`;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'apkFile') return cb(null, apkDir);
    if (file.fieldname === 'logoFile') return cb(null, logoDir);
    return cb(new Error('Bilinmeyen dosya alanı.'));
  },
  filename: (req, file, cb) => cb(null, safeName(file.originalname))
});

const maxApkMb = Number(process.env.UPLOAD_MAX_APK_MB || 250);

const upload = multer({
  storage,
  limits: {
    fileSize: maxApkMb * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === 'apkFile') {
      if (ext !== '.apk') return cb(new Error('Sadece .apk dosyası yüklenebilir.'));
      return cb(null, true);
    }

    if (file.fieldname === 'logoFile') {
      const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
      if (!allowed.includes(ext)) return cb(new Error('Logo sadece PNG, JPG, JPEG veya WEBP olabilir.'));
      return cb(null, true);
    }

    return cb(new Error('Bilinmeyen dosya alanı.'));
  }
});

module.exports = upload;
