<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1">{{ label }}</label>
    <select
      :id="id"
      :value="currentValue"
      v-bind="cleanAttrs"
      :class="baseClass"
      @change="onChange"
      @blur="onBlur"
    >
      <template v-if="options && options.length">
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option v-for="(opt, idx) in normalizedOptions" :key="idx" :value="opt.value">
          {{ opt.label }}
        </option>
      </template>
      <slot v-else />
    </select>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
import { computed, useAttrs } from 'vue'
type Opt = { label: string; value: any }
const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  id: { type: String, default: () => `select-${Math.random().toString(36).slice(2, 8)}` },
  label: String,
  options: { type: Array as () => string[] | Opt[], default: undefined },
  placeholder: { type: String, default: '' },
  error: String,
})
const emit = defineEmits(['update:modelValue', 'change', 'blur'])
const attrs = useAttrs()
const currentValue = computed(() =>
  props.modelValue !== undefined ? props.modelValue : ((attrs as any).value ?? ''),
)
const cleanAttrs = computed(() => {
  const copy = { ...(attrs as Record<string, any>) }
  delete copy.value
  delete copy.modelValue
  delete copy.onChange
  delete copy.onBlur
  return copy
})
const baseClass =
  'w-full rounded-md px-3 py-2 border bg-white dark:bg-slate-800 dark:text-slate-100'
const normalizedOptions = computed<Opt[]>(() => {
  const o: any = props.options
  if (!o) return []
  return o.map((it: any) =>
    typeof it === 'object'
      ? { label: it.label ?? String(it.value), value: it.value }
      : { label: String(it), value: it },
  )
})
function callAttr(name: string, e: Event) {
  const h = (attrs as any)[name]
  if (!h) return
  if (typeof h === 'function') h(e)
  else if (Array.isArray(h)) h.forEach((fn) => typeof fn === 'function' && fn(e))
}
function onChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  emit('update:modelValue', v)
  emit('change', e)
  callAttr('onChange', e)
}
function onBlur(e: Event) {
  emit('blur', e)
  callAttr('onBlur', e)
}
</script>
