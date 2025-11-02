<template>
  <nav class="w-full bg-white dark:bg-slate-900 border-b dark:border-slate-800">
    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div>
          <div class="font-semibold text-slate-900 dark:text-slate-100">{{ $t('title') }}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400">
            Apply quickly — your draft is saved
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button class="px-3 py-1 rounded-md border text-sm" @click="onSave">
          {{ $t('save') }}
        </button>
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
import { useFormStore } from '@/stores/useFormStore'
import { useI18n } from 'vue-i18n'
import { useUIStore } from '@/stores/uiStore'
import { useToast } from '@/composables/useToast'
const ui = useUIStore()
const form = useFormStore()
const { locale } = useI18n()
const { push } = useToast()
function onLocale() {
  locale.value = ui.locale
}
function onSave() {
  form.manualSave()
  push(String((window as any).__t__('messages.saved') || 'Saved locally'), 'success', 1500)
}
</script>
