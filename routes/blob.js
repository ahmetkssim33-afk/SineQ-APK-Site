const express = require('express');

const router = express.Router();

function parsePayload(clientPayload) {
  try {
    return JSON.parse(clientPayload || '{}');
  } catch (_) {
    return {};
  }
}

router.post('/upload', async (req, res, next) => {
  try {
    const { handleUpload } = await import('@vercel/blob/client');
    const maxApkMb = Number(process.env.UPLOAD_MAX_APK_MB || 250);
    const maxLogoMb = Number(process.env.UPLOAD_MAX_LOGO_MB || 8);

    const response = await handleUpload({
      request: req,
      body: req.body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!req.session?.isAdmin) {
          throw new Error('Yetkisiz işlem. Lütfen admin paneline tekrar giriş yapın.');
        }

        const payload = parsePayload(clientPayload);
        const type = payload.type === 'logo' ? 'logo' : 'apk';

        if (type === 'logo') {
          return {
            allowedContentTypes: ['image/png', 'image/jpeg', 'image/webp'],
            maximumSizeInBytes: maxLogoMb * 1024 * 1024,
            addRandomSuffix: true
          };
        }

        return {
          allowedContentTypes: [
            'application/vnd.android.package-archive',
            'application/octet-stream'
          ],
          maximumSizeInBytes: maxApkMb * 1024 * 1024,
          addRandomSuffix: true
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Blob yüklendi:', blob.url, tokenPayload || '');
      }
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
