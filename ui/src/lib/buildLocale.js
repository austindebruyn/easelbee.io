import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import Vue from 'vue';
import VueI18Next from '@panter/vue-i18next';
import store from 'state/store';

export default function () {
  Vue.use(VueI18Next);

  i18next.on('loaded', function (loaded) {
    store.commit('fetchI18nSuccess');
  });

  i18next
    .use(i18nextBrowserLanguageDetector)
    .use(i18nextXHRBackend)
    .init({
      fallbackLng: 'en',
      debug: process.env.NODE_ENV !== 'production',
      backend: {
        loadPath: '/locale/{{ lng }}.json'
      }
    });

  return new VueI18Next(i18next);
};
