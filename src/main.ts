import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n'
import GlobalComponents from '@/plugins/global-components'

import App from './App.vue'
import router from './router'
import { setupDynamicTitles } from '@/composables/useRouteTitle'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(GlobalComponents)
app.use(i18n)

setupDynamicTitles(router, { suffix: '' })

router.isReady().then(() => {
  app.mount('#app')
})
