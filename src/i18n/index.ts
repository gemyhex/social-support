import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ar from './locales/ar.json'

const savedLocale = (() => {
  try {
    const loc = localStorage.getItem('locale')
    return typeof loc === 'string' && loc.trim() ? loc : 'en'
  } catch {
    return 'en'
  }
})()

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, ar }
})
