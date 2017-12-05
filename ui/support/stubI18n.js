import i18next from 'i18next';
import Vue from 'vue';
import VueI18Next from '@panter/vue-i18next';

export default function () {
  Vue.use(VueI18Next);

  i18next.init({
    lng: 'en',
    debug: false,
    resources: {
      en: {
        translation: require('../../public/locale/en.json')
      }
    }
  });

  return new VueI18Next(i18next);
};
