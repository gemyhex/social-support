<template>
  <button
    :class="btnClass"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
    v-bind="attrs"
  >
    <span v-if="loading" class="inline-block animate-spin mr-2">⏳</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAttrs } from 'vue'

const attrs = useAttrs()

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost
  size: { type: String, default: 'md' }, // sm | md | lg
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const btnClass = computed(() => {
  const base =
    'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2'
  const sizeMap: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  }
  const variantMap: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-white border text-slate-700 hover:bg-slate-50 focus:ring-slate-300',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  }
  return `${base} ${sizeMap[props.size] || sizeMap.md} ${variantMap[props.variant] || variantMap.primary} ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''}`
})
</script>
