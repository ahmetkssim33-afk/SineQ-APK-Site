require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');

const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const blobRoutes = require('./routes/blob');

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

app.use('/css', express.static(path.join(__dirname, 'public', 'css'), { maxAge: '7d' }));
app.use('/js', express.static(path.join(__dirname, 'public', 'js'), { maxAge: '7d' }));

const sessionSecret = process.env.SESSION_SECRET || 'dev_secret_change_me';
const mongoUrl = process.env.MONGODB_URI;

app.use(session({
  name: 'sineq.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8
  },
  store: MongoStore.create({
    mongoUrl,
    ttl: 60 * 60 * 8,
    autoRemove: 'native'
  })
}));

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
    ? 'Bir hata oluştu.'
    : err.message;
  res.status(500).send(`<h1>Sunucu Hatası</h1><p>${message}</p>`);
});

module.exports = app;
