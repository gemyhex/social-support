<template>
  <header class="w-full border-b border-slate-200 dark:border-slate-800 bg-transparent">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <RouterLink to="/" class="text-sm font-semibold">
          {{ t('meta.appTitle') }}
        </RouterLink>
      </div>

      <div class="flex items-center gap-3">
        <BaseSelect v-model="ui.locale" :options="langOptions" class="w-24" />

        <BaseButton
          type="button"
          variant="secondary"
          size="sm"
          class="p-2 w-10 h-10 flex items-center justify-center rounded-lg glass text-lg"
          @click.stop="ui.toggleTheme"
          aria-label="toggleTheme"
        >
          <span v-if="ui.theme === 'dark'">☀️</span>
          <span v-else>🌙</span>
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/uiStore'

const { locale, t } = useI18n()
const ui = useUIStore()

const langOptions = [
  { label: 'EN', value: 'en' },
  { label: 'العربية', value: 'ar' },
]

watch(
  () => ui.locale,
  (newVal) => {
    if (locale.value !== newVal) locale.value = newVal
  },
  { immediate: true },
)

watch(
  () => locale.value,
  (newVal) => {
    if (ui.locale !== newVal) ui.setLocale(newVal)
  },
)
</script>
