import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const THEME_KEY = 'theme';
const LOCALE_KEY = 'locale';

export const useUIStore = defineStore('ui', () => {
  const savedTheme = (() => { try { return localStorage.getItem(THEME_KEY) } catch { return null } })();
  const savedLocale = (() => { try { return localStorage.getItem(LOCALE_KEY) } catch { return null } })();

  const theme = ref<'light' | 'dark'>(savedTheme === 'dark' ? 'dark' : 'light');
  const locale = ref<string>(savedLocale || 'en');

  watch(theme, (t) => {
    try { localStorage.setItem(THEME_KEY, t); } catch { }
    document.documentElement.classList.toggle('dark', t === 'dark');
  }, { immediate: true });

  watch(locale, (l) => {
    try { localStorage.setItem(LOCALE_KEY, l); } catch { }
  }, { immediate: true });

  function toggleTheme() { theme.value = theme.value === 'dark' ? 'light' : 'dark'; }
  function setLocale(l: string) { locale.value = l; }

  return { theme, toggleTheme, locale, setLocale };
});
