<template>
  <button
    v-bind="forwardedAttrs"
    :type="type"
    :class="buttonClass"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span v-if="loading" class="inline-block animate-spin mr-2">⏳</span>
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

import { computed } from 'vue'
import { useAttrs } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  variant: { type: String, default: 'primary' }, // primary, secondary, ghost
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})

const emit = defineEmits(['click'])
const attrs = useAttrs()

const buttonClass = computed(() => {
  const base =
    'inline-flex items-center justify-center font-medium transition rounded-md select-none'
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
    full: 'w-full px-10 py-3 text-base',
  }
  const variants: Record<string, string> = {
    primary: 'bg-primary-500 text-white btn-primary',
    secondary: 'bg-white border text-slate-800 dark:bg-slate-800 dark:text-slate-100',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-200',
  }
  return [
    base,
    sizes[props.size] || sizes.md,
    variants[props.variant] || variants.primary,
    attrs.class || '',
  ]
    .join(' ')
    .trim()
})

// Filter attrs: forward everything except event listeners (keys starting with "on")
const forwardedAttrs = computed(() => {
  const out: Record<string, any> = {}
  Object.entries(attrs).forEach(([k, v]) => {
    // skip event listeners that start with "on" (Vue normalized attr names)
    if (/^on[A-Z]/.test(k)) return
    out[k] = v
  })
  // ensure type/class/id/aria from props or attrs are preserved:
  if (!out.type) out.type = props.type
  return out
})

function onClick(e: MouseEvent) {
  if (props.disabled) return
  emit('click', e)
}
</script>
