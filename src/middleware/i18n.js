const i18next = require('i18next');
const i18nMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');

i18next
  .use(Backend)
  .use(i18nMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'fr', 'es'],
    backend: {
      loadPath: './src/Translations/{{lng}}.json',
    },
  });

module.exports = i18nMiddleware.handle(i18next);