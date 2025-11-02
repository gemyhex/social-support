<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center"
    aria-modal="true"
    role="dialog"
  >
    <!-- backdrop -->
    <div class="absolute inset-0 bg-black/40" @click="close" aria-hidden="true"></div>

    <!-- modal -->
    <div
      class="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 rounded-lg shadow p-4"
      role="document"
      aria-labelledby="help-title"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 id="help-title" class="text-lg font-semibold">{{ $t('help_me_write') }}</h3>
        <button class="text-sm px-2 py-1" @click="close" aria-label="close">✕</button>
      </div>

      <p class="text-sm text-slate-600 mb-3">
        <strong>{{ $t('prompt') }}:</strong>
        <span v-if="promptDisplay">{{ promptDisplay }}</span>
        <span v-else class="italic text-slate-400">{{ examplePrompt }}</span>
      </p>

      <!-- editable suggestion -->
      <textarea
        v-model="suggestion"
        rows="7"
        :placeholder="$t('suggestion_placeholder')"
        class="w-full border rounded p-2 mb-3 bg-white dark:bg-slate-800 dark:text-slate-100"
        :aria-label="$t('suggestion')"
      ></textarea>

      <div class="flex items-center justify-between gap-2">
        <div class="text-xs text-slate-500">
          <span v-if="loading">{{ $t('generating_suggestion') }}</span>
          <span v-else-if="error" class="text-red-500">{{ error }}</span>
        </div>

        <div class="flex items-center gap-2">
          <button type="button" class="px-3 py-1 border rounded" @click="close" :disabled="loading">
            {{ $t('discard') }}
          </button>

          <!-- Edit triggers regeneration (explicit) -->
          <button
            type="button"
            class="px-3 py-1 bg-gray-200 rounded"
            @click="fetchSuggestion"
            :disabled="loading"
            v-if="!loading"
          >
            {{ $t('edit') }}
          </button>

          <button
            type="button"
            class="px-3 py-1 bg-blue-600 text-white rounded"
            @click="accept"
            :disabled="loading || !suggestion"
          >
            {{ $t('accept') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { openAI } from '@/plugins/openai'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/* state */
const open = ref(false)
const field = ref('')
const prompt = ref('')
const suggestion = ref('')
const loading = ref(false)
const error = ref('')

const examplePrompt = 'I am unemployed with no income. Help me describe my financial hardship.'

const promptDisplay = computed(() => (prompt.value ? prompt.value : ''))

/* simple in-memory cache so we don't regenerate on every open
   persisted on window to survive HMR during dev */
const globalCache = ((window as any).__helpSuggestions = (window as any).__helpSuggestions || {})

let listenerAttached = (window as any).__helpModalListenerAttached || false

function onOpen(e: Event) {
  const d = (e as CustomEvent)?.detail || {}
  field.value = d.field || ''
  prompt.value = d.prompt || ''
  error.value = ''
  loading.value = false

  // load cached suggestion if present — do NOT call API automatically
  const cached = field.value ? globalCache[field.value] : undefined
  if (cached) {
    suggestion.value = cached
    return (open.value = true)
  }

  suggestion.value = ''
  open.value = true
  fetchSuggestion()
}

function close() {
  open.value = false
  field.value = ''
  prompt.value = ''
  suggestion.value = ''
  loading.value = false
  error.value = ''
}

function accept() {
  if (!field.value || !suggestion.value) {
    close()
    return
  }
  // save to cache
  globalCache[field.value] = suggestion.value

  // dispatch event so parent can apply suggestion
  window.dispatchEvent(
    new CustomEvent('apply-suggestion', { detail: { field: field.value, text: suggestion.value } }),
  )
  close()
}

async function fetchSuggestion() {
  suggestion.value = ''
  loading.value = true
  error.value = ''

  try {
    if (import.meta.env.VITE_MOCK_OPENAI === 'true') {
      await new Promise((r) => setTimeout(r, 400))
      suggestion.value = `Mock suggestion: "${prompt.value || examplePrompt}"`
    } else {
      const svc = openAI()
      const text = await svc.generate(prompt.value || examplePrompt, 10000)
      suggestion.value = (text || '').trim()
    }
  } catch (err: any) {
    console.error('fetchSuggestion error', err)
    error.value =
      err?.message || t('errors.fetchSuggestionFailed') || 'Failed to generate suggestion'
  } finally {
    loading.value = false
  }
}

/* event wiring — single global listener to avoid duplicates across HMR */
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
    listenerAttached = false
    ;(window as any).__helpModalListenerAttached = false
  }
})
</script>

<style scoped>
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}
</style>
