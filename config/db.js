const mongoose = require('mongoose');

let cachedPromise = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI ortam değişkeni tanımlı değil. Vercel > Settings > Environment Variables bölümüne ekleyip Redeploy yapın.');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    mongoose.set('bufferCommands', false);
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 20000,
      maxPoolSize: 5
    }).catch((err) => {
      cachedPromise = null;
      throw err;
    });
  }

  await cachedPromise;
  return mongoose.connection;
}

module.exports = connectDB;
