<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center"
    aria-modal="true"
    role="dialog"
  >
    <div class="absolute inset-0 bg-black/40" @click="close" aria-hidden="true"></div>

    <div
      class="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 rounded-lg shadow p-4"
      role="document"
      aria-labelledby="help-title"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 id="help-title" class="text-lg font-semibold">{{ t('help_me_write') }}</h3>
        <BaseButton type="button" variant="ghost" size="sm" @click="close" aria-label="close">
          ✕
        </BaseButton>
      </div>

      <p class="text-sm text-slate-600 mb-3">
        <strong>{{ t('prompt') }}:</strong>
        <span v-if="promptDisplay">{{ promptDisplay }}</span>
        <span v-else class="italic text-slate-400">{{ examplePromptLocalized }}</span>
      </p>

      <BaseTextarea
        v-model="suggestion"
        :rows="7"
        :placeholder="t('suggestion_placeholder')"
        class="w-full mb-3"
        :aria-label="t('suggestion')"
      />

      <div class="flex items-center justify-between gap-2">
        <div class="text-xs text-slate-500">
          <span v-if="loading">{{ t('generating_suggestion') }}</span>
          <span v-else-if="error" class="text-red-500">{{ error }}</span>
        </div>

        <div class="flex items-center gap-2">
          <BaseButton
            type="button"
            variant="secondary"
            size="sm"
            @click="close"
            :disabled="loading"
          >
            {{ t('discard') }}
          </BaseButton>

          <BaseButton
            type="button"
            variant="ghost"
            size="sm"
            @click="fetchSuggestion"
            :disabled="loading"
            v-if="!loading"
          >
            {{ t('edit') }}
          </BaseButton>

          <BaseButton
            type="button"
            variant="primary"
            size="sm"
            @click="accept"
            :disabled="loading || !suggestion"
          >
            {{ t('accept') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { openAI } from '@/plugins/openai'
const { t } = useI18n()

const open = ref(false)
const field = ref('')
const prompt = ref('')
const suggestion = ref('')
const loading = ref(false)
const error = ref('')

const examplePrompt = 'I am unemployed with no income. Help me describe my financial hardship.'
const examplePromptLocalized = computed(() => t('example_prompt') ?? examplePrompt)

const promptDisplay = computed(() => (prompt.value ? prompt.value : ''))

/* in-memory cache to avoid re-generating for same field */
const globalCache = ((window as any).__helpSuggestions = (window as any).__helpSuggestions || {})

let listenerAttached = (window as any).__helpModalListenerAttached || false

function onOpen(e: Event) {
  const d = (e as CustomEvent)?.detail || {}
  field.value = d.field || ''
  prompt.value = d.prompt || ''
  error.value = ''
  loading.value = false

  // load cached suggestion if present — do NOT call API automatically when cached
  const cached = field.value ? globalCache[field.value] : undefined
  if (cached) {
    suggestion.value = cached
    open.value = true
    return
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
  // clear previous value
  suggestion.value = ''
  loading.value = true
  error.value = ''

  try {
    if (import.meta.env.VITE_MOCK_OPENAI === 'true') {
      await new Promise((r) => setTimeout(r, 400))
      suggestion.value = `Mock suggestion: "${prompt.value || examplePromptLocalized.value}"`
    } else {
      const OpenAI = openAI()
      const text = await OpenAI.generate(prompt.value || examplePromptLocalized.value, 10000)
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

/* single global listener to avoid duplicates */
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
