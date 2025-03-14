import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

import '@ionic/vue/css/palettes/dark.always.css';
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
// import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { createPinia, storeToRefs } from 'pinia';
import initDb from './initDb';
import { i18n, initI18n } from './plugins/i18n';
import providers from './plugins/providers';
import useApp from './store/useApp';

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(createPinia())
  .use(i18n);

providers(app, false)

router.isReady().then(() => {
  initDb().then(() =>
    initI18n().then(() => {
      app.mount('#app')
      const { myApp } = storeToRefs(useApp())
      myApp.value = app
    }
    )
  ).catch(err => alert(err))
});
