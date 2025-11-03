<template>
  <header class="w-full border-b border-slate-200 dark:border-slate-800 bg-transparent">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <RouterLink to="/" class="text-sm font-semibold">{{ t('title') }}</RouterLink>
      </div>
      <div class="flex items-center gap-3">
        <BaseSelect v-model="lang" :options="langOptions" class="w-24" @change="changeLang" />

        <BaseButton
          type="button"
          variant="secondary"
          size="sm"
          class="p-2 w-10 h-10 flex items-center justify-center rounded-lg glass text-lg"
          @click="toggleTheme"
          aria-label="Toggle theme"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const lang = ref(locale.value || 'en')
const langOptions = [
  { label: 'EN', value: 'en' },
  { label: 'العربية', value: 'ar' },
]

watchEffect(() => {
  lang.value = locale.value
})

function changeLang(val?: string) {
  const v = val ?? lang.value
  locale.value = v
  lang.value = v
}

const isDark = ref(false)

function initTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
  } else if (saved === 'light') {
    isDark.value = false
  } else {
    isDark.value = document.documentElement.classList.contains('dark')
  }
  document.documentElement.classList.toggle('dark', isDark.value)
}
initTheme()

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
</script>
