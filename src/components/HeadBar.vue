<!-- src/components/HeaderBar.vue -->
<template>
  <header class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-3">
      <div>
        <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Social Support Application
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Apply quickly — we’ll save your draft
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <!-- Locale -->
      <div class="flex items-center gap-2">
        <label for="locale" class="sr-only">Language</label>
        <select
          id="locale"
          v-model="ui.locale"
          @change="onLocale"
          class="px-2 py-1 bg-white dark:bg-slate-800 border rounded text-sm"
        >
          <option value="en">EN</option>
          <option value="ar">العربية</option>
        </select>
      </div>

      <!-- Theme toggle -->
      <button
        @click="ui.toggleTheme()"
        :aria-pressed="ui.theme === 'dark'"
        class="flex items-center gap-2 px-3 py-1 border rounded bg-white dark:bg-slate-800"
        title="Toggle theme"
      >
        <svg
          v-if="ui.theme === 'dark'"
          class="w-4 h-4 text-yellow-300"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
        <svg v-else class="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
        <span class="text-sm text-slate-700 dark:text-slate-200">{{
          ui.theme === 'dark' ? 'Dark' : 'Light'
        }}</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/uiStore'
import { useI18n } from 'vue-i18n'

const ui = useUIStore()
const { locale } = useI18n()

function onLocale() {
  locale.value = ui.locale
}
</script>

<style scoped>
/* small header styles already applied via Tailwind */
</style>
