<template>
  <nav class="w-full bg-white dark:bg-slate-900 border-b dark:border-slate-800">
    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div>
          <div class="font-semibold text-slate-900 dark:text-slate-100">{{ $t('title') }}</div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="ui.locale"
          @change="onLocale"
          class="px-2 py-1 rounded-md border text-sm bg-white dark:bg-slate-800"
        >
          <option value="en">EN</option>
          <option value="ar">العربية</option>
        </select>
        <button @click="ui.toggleTheme" class="px-3 py-1 rounded-md border text-sm">
          <span v-if="ui.theme === 'dark'">Light</span>
          <span v-else>Dark</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/uiStore'
const ui = useUIStore()
const { locale } = useI18n()
function onLocale() {
  locale.value = ui.locale
}
</script>
