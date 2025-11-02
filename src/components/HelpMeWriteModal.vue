<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" data-help-modal>
    <div class="absolute inset-0 bg-black/40" @click="close" aria-hidden="true"></div>

    <div class="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 rounded-lg shadow p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">{{ $t('help_me_write') }}</h3>
        <button class="text-sm" @click="close" aria-label="close">✕</button>
      </div>

      <p class="text-sm text-slate-600 mb-3">
        <strong>{{ $t('prompt') }}:</strong> {{ prompt }}
      </p>

      <textarea
        v-model="suggestion"
        rows="6"
        class="w-full border rounded p-2 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100"
        placeholder="Suggestion will appear here..."
      ></textarea>

      <div class="flex items-center justify-end gap-2">
        <button class="px-3 py-1 border rounded" @click="close">{{ $t('discard') }}</button>
        <button
          class="px-3 py-1 bg-blue-600 text-white rounded"
          @click="accept"
          :disabled="loading || !suggestion"
        >
          {{ $t('accept') }}
        </button>
      </div>

      <p v-if="loading" class="text-xs text-slate-500 mt-2">{{ $t('generating_suggestion') }}</p>
      <p v-if="error" class="text-xs text-red-500 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { openAI } from '@/plugins/openai'

const open = ref(false)
const prompt = ref('')
const field = ref('')
const suggestion = ref('')
const loading = ref(false)
const error = ref('')

let listenerAttached = (window as any).__helpModalListenerAttached || false

function onOpen(e: Event) {
  const d = (e as CustomEvent).detail || {}
  field.value = d.field || ''
  prompt.value = d.prompt || ''
  suggestion.value = ''
  error.value = ''
  open.value = true
  if (!loading.value) fetchSuggestion()
}

function close() {
  open.value = false
  prompt.value = ''
  field.value = ''
  suggestion.value = ''
  loading.value = false
  error.value = ''
}

async function fetchSuggestion() {
  loading.value = true
  error.value = ''
  try {
    if (import.meta.env.VITE_MOCK_OPENAI === 'true') {
      // mock for dev: fast, free
      await new Promise((r) => setTimeout(r, 300))
      suggestion.value = `Mocked suggestion for "${prompt.value.slice(0, 80)}..."`
    } else {
      const svc = openAI()
      const text = await svc.generate(prompt.value, 10000)
      suggestion.value = (text || '').trim()
    }
  } catch (err: any) {
    error.value = err?.message || 'Failed to generate suggestion'
    console.error('[HelpModal] error', err)
  } finally {
    loading.value = false
  }
}

function accept() {
  if (!field.value) return close()
  window.dispatchEvent(
    new CustomEvent('apply-suggestion', { detail: { field: field.value, text: suggestion.value } }),
  )
  close()
}

onMounted(() => {
  if (!listenerAttached) {
    window.addEventListener('open-help', onOpen as EventListener)
    listenerAttached = true
    ;(window as any).__helpModalListenerAttached = true
  }
})
onBeforeUnmount(() => {
  if (listenerAttached) {
    window.removeEventListener('open-help', onOpen as EventListener)
    ;(window as any).__helpModalListenerAttached = false
    listenerAttached = false
  }
})
</script>

<style scoped>
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}
</style>
