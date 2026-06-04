const app = require('../app');
const connectDB = require('../config/db');

let ready = null;

module.exports = async (req, res) => {
  if (!ready) ready = connectDB();
  await ready;
  return app(req, res);
};
