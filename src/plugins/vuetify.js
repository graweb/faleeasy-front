import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

// Translation provided by Vuetify (javascript)
import pt from 'vuetify/lib/locale/pt'

export default new Vuetify({
  lang: {
    locales: { pt },
    current: 'pt',
  },
});
