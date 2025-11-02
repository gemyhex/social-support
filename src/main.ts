import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n';
import registerGlobalComponents from '@/plugins/global-components';

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(i18n)

registerGlobalComponents(app);

// Wait for router to be ready to avoid initial flicker
router.isReady().then(() => {
  app.mount('#app')
})
