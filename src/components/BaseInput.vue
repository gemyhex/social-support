<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="currentValue"
      v-bind="cleanAttrs"
      :placeholder="placeholder"
      :class="baseClass"
      @input="onInput"
      @change="onChange"
      @blur="onBlur"
    />
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2, 8)}` },
  label: String,
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: String,
})
const emit = defineEmits(['update:modelValue', 'input', 'change', 'blur'])
const attrs = useAttrs()
const currentValue = computed(() =>
  props.modelValue !== undefined ? props.modelValue : ((attrs as any).value ?? ''),
)
const cleanAttrs = computed(() => {
  const copy = { ...(attrs as Record<string, any>) }
  delete copy.value
  delete copy.modelValue
  delete copy.onInput
  delete copy.onChange
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
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
  emit('input', e)
  callAttr('onInput', e)
}
function onChange(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
  emit('change', e)
  callAttr('onChange', e)
}
function onBlur(e: Event) {
  emit('blur', e)
  callAttr('onBlur', e)
}
</script>
