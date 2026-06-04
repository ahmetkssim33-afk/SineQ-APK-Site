require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
  await connectDB();

  const username = (await ask('Admin kullanıcı adı: ')).trim();
  const password = await ask('Admin şifre: ');

  if (!username || password.length < 8) {
    throw new Error('Kullanıcı adı zorunlu, şifre en az 8 karakter olmalı.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate(
    { username },
    { username, passwordHash, role: 'admin' },
    { upsert: true, new: true }
  );

  console.log('Admin oluşturuldu/güncellendi.');
  rl.close();
  process.exit(0);
}

main().catch(err => {
  console.error(err.message);
  rl.close();
  process.exit(1);
});
