require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const blobRoutes = require('./routes/blob');
const { attachAdmin } = require('./utils/authToken');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true, limit: '3mb' }));
app.use(express.json({ limit: '3mb' }));
app.use(methodOverride('_method'));
app.use(attachAdmin);

app.use('/css', express.static(path.join(__dirname, 'public', 'css'), { maxAge: '7d' }));
app.use('/js', express.static(path.join(__dirname, 'public', 'js'), { maxAge: '7d' }));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    mongoReadyState: mongoose.connection.readyState,
    env: {
      MONGODB_URI: Boolean(process.env.MONGODB_URI),
      SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
      BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      NODE_ENV: process.env.NODE_ENV || null
    }
  });
});

app.use('/api/blob', blobRoutes);
app.use('/', publicRoutes);
app.use('/admin', authRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Sayfa bulunamadı' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const message = process.env.NODE_ENV === 'production'
    ? 'Bir hata oluştu. Vercel Logs bölümünden detayına bakın.'
    : err.message;
  res.status(500).send(`<h1>Sunucu Hatası</h1><p>${message}</p>`);
});

module.exports = app;
