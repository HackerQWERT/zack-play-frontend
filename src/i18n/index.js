const { i18n } = require('./next-i18next.config');

module.exports = {
  ...i18n,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

module.exports.i18n = i18n;