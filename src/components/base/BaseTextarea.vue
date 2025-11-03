<template>
  <div class="field-item">
    <label v-if="label" :for="computedId" class="block text-sm font-medium mb-1">{{ label }}</label>

    <textarea
      :id="computedId"
      v-bind="forwardedAttrs"
      :placeholder="placeholder"
      :rows="rows"
      :value="internalValue"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
      :aria-invalid="ariaInvalid"
      :aria-describedby="ariaDescribedBy"
      @input="onInput"
      @change="onChange"
      ref="refEl"
      class="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-800 dark:text-slate-100"
    ></textarea>

    <p v-if="errorMsg" class="text-xs text-red-500 mt-1" :id="computedId + '-err'">
      {{ errorMsg }}
    </p>
    <p v-else-if="hint" class="text-xs text-slate-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 4 },
  id: { type: String, default: '' },
  hint: { type: String, default: '' },
  errorMsg: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'input', 'change'])
const attrs = useAttrs()
const refEl = ref<HTMLTextAreaElement | null>(null)

function uid() {
  return 'textarea-' + Math.random().toString(36).slice(2, 9)
}
const computedId = computed(() => props.id || uid())
const internalValue = computed(() => (attrs as any).value ?? props.modelValue ?? '')

const forwardedAttrs = computed(() => {
  const out: Record<string, any> = {}
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'onInput' || k === 'onChange' || k === 'onUpdate:modelValue') return
    out[k] = v
  })
  return out
})

const ariaInvalid = computed(() => (props.errorMsg ? 'true' : null))
const ariaDescribedBy = computed(() => (props.errorMsg ? computedId.value + '-err' : null))

function onInput(e: Event) {
  const val = (e.target as HTMLTextAreaElement).value
  if (typeof (attrs as any).onInput === 'function') (attrs as any).onInput(e)
  emit('update:modelValue', val)
  emit('input', val)
}
function onChange(e: Event) {
  if (typeof (attrs as any).onChange === 'function') (attrs as any).onChange(e)
  emit('change', (e.target as HTMLTextAreaElement).value)
}
</script>

<style scoped>
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}
</style>
