<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1">{{ label }}</label>
    <textarea
      :id="id"
      :value="currentValue"
      v-bind="cleanAttrs"
      :rows="rows"
      :class="baseClass"
      @input="onInput"
      @blur="onBlur"
    ></textarea>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
const props = defineProps({
  modelValue: { type: String, default: undefined },
  id: { type: String, default: () => `ta-${Math.random().toString(36).slice(2, 8)}` },
  label: String,
  rows: { type: Number, default: 4 },
  error: String,
})
const emit = defineEmits(['update:modelValue', 'input', 'blur'])
const attrs = useAttrs()
const currentValue = computed(() =>
  props.modelValue !== undefined ? props.modelValue : ((attrs as any).value ?? ''),
)
const cleanAttrs = computed(() => {
  const copy = { ...(attrs as Record<string, any>) }
  delete copy.value
  delete copy.modelValue
  delete copy.onInput
  delete copy.onBlur
  return copy
})
const baseClass =
  'w-full rounded-md px-3 py-2 border bg-white dark:bg-slate-800 dark:text-slate-100'
function callAttr(name: string, e: Event) {
  const h = (attrs as any)[name]
  if (!h) return
  if (typeof h === 'function') h(e)
  else if (Array.isArray(h)) h.forEach((fn) => typeof fn === 'function' && fn(e))
}
function onInput(e: Event) {
  const v = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', v)
  emit('input', e)
  callAttr('onInput', e)
}
function onBlur(e: Event) {
  emit('blur', e)
  callAttr('onBlur', e)
}
</script>
