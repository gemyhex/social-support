<!-- components/BaseInput.vue -->
<template>
  <div class="field-item">
    <label v-if="label" :for="computedId" class="block text-sm font-medium mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="computedId"
        v-bind="forwardedAttrs"
        :type="type"
        :placeholder="placeholder"
        :value="internalValue"
        @input="onInput"
        @change="onChange"
        ref="inputRef"
        class="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-800 dark:text-slate-100"
      />
    </div>
    <p v-if="errorMsg" class="text-xs text-red-500 mt-1">{{ errorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  id: { type: String, default: '' },
  required: { type: Boolean, default: false },
  errorMsg: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'input', 'change'])
const attrs = useAttrs()
const inputRef = ref<HTMLInputElement | null>(null)
function uid() {
  return 'input-' + Math.random().toString(36).slice(2, 9)
}
const computedId = computed(() => props.id || uid())

/* Value precedence: Field (attrs.value) > v-model */
const internalValue = computed(() => (attrs as any).value ?? props.modelValue ?? '')

/* forward non-event attributes to native input so Field's name/data-name are applied */
const forwardedAttrs = computed(() => {
  const out: Record<string, any> = {}
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'onInput' || k === 'onChange' || k === 'onUpdate:modelValue') return
    out[k] = v
  })
  return out
})

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  if (typeof (attrs as any).onInput === 'function') (attrs as any).onInput(e) // call field handler
  emit('update:modelValue', value)
  emit('input', value)
}
function onChange(e: Event) {
  if (typeof (attrs as any).onChange === 'function') (attrs as any).onChange(e)
  emit('change', (e.target as HTMLInputElement).value)
}
</script>
