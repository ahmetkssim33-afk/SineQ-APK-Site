const mongoose = require('mongoose');

let cachedPromise = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI .env dosyasında tanımlı değil.');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
  }

  await cachedPromise;
  return mongoose.connection;
}

module.exports = connectDB;
