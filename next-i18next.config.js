/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'id'],
  },
  // Kita hapus penggunaan require('path') dan mengandalkan path default:
  // Library akan otomatis mencari di folder ./public/locales
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};