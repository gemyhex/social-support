import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n';

import App from './App.vue'
import router from './router'

import GlobalComponents from '@/plugins/global-components';

createApp(App)
  .use(router)
  .use(createPinia())
  .use(i18n)
  .use(GlobalComponents)
  .mount('#app');
