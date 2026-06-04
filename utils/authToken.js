const crypto = require('crypto');

function getSecret() {
  return process.env.SESSION_SECRET || 'dev_secret_change_me';
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function fromBase64url(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 ? '='.repeat(4 - (normalized.length % 4)) : '';
  return Buffer.from(normalized + padding, 'base64').toString('utf8');
}

function sign(value) {
  return crypto
    .createHmac('sha256', getSecret())
    .update(value)
    .digest('base64url');
}

function createAdminToken(admin) {
  const payload = {
    id: String(admin._id || admin.id),
    username: String(admin.username || ''),
    exp: Date.now() + 1000 * 60 * 60 * 8
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

function verifyAdminToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(fromBase64url(encoded));
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (!payload.id || !payload.username) return null;
    return payload;
  } catch (_) {
    return null;
  }
}

function readCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, part) => {
    const index = part.indexOf('=');
    if (index === -1) return cookies;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function attachAdmin(req, res, next) {
  const cookies = readCookies(req.headers.cookie || '');
  req.admin = verifyAdminToken(cookies.sineq_admin);
  next();
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8,
    path: '/'
  };
}

module.exports = {
  createAdminToken,
  verifyAdminToken,
  attachAdmin,
  cookieOptions
};
