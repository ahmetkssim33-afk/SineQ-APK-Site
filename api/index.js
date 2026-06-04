const app = require('../app');
const connectDB = require('../config/db');

let ready = null;

module.exports = async (req, res) => {
  try {
    if (!ready) {
      ready = connectDB().catch((err) => {
        ready = null;
        throw err;
      });
    }
    await ready;
    return app(req, res);
  } catch (err) {
    console.error('Vercel başlangıç/DB hatası:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end('<h1>Sunucu Hatası</h1><p>MongoDB bağlantısı kurulamadı. Vercel Logs bölümünden detayına bakın.</p>');
  }
};
