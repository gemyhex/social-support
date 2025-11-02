import { ref, watch } from 'vue';

const theme = ref(localStorage.getItem('theme') || 'light');

watch(theme, (val) => {
  localStorage.setItem('theme', val);
  document.documentElement.classList.toggle('dark', val === 'dark');
}, { immediate: true });

export function useTheme() {
  return { theme, toggle: () => theme.value = theme.value === 'dark' ? 'light' : 'dark' };
}
