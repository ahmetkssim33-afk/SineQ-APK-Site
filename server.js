require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`SineQ çalışıyor: http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Başlatma hatası:', err.message);
    process.exit(1);
  });
