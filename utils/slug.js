const slugify = require('slugify');
const AppRelease = require('../models/AppRelease');

async function makeUniqueSlug(appName, version) {
  const raw = `${appName}-${version}`;
  const base = slugify(raw, { lower: true, strict: true, locale: 'tr' }) || `app-${Date.now()}`;
  let slug = base;
  let index = 1;

  while (await AppRelease.exists({ slug })) {
    slug = `${base}-${index}`;
    index += 1;
  }

  return slug;
}

module.exports = makeUniqueSlug;
