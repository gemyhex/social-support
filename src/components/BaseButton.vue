<template>
  <button :type="type" :disabled="disabled" @click="onClick" :class="cls"><slot /></button>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
const emit = defineEmits(['click'])
function onClick(e: Event) {
  if (props.disabled) return
  emit('click', e)
}
const cls = computed(() =>
  [
    'rounded-md font-medium focus:outline-none',
    props.size === 'sm' ? 'px-3 py-1 text-sm' : 'px-4 py-2 text-sm',
    props.variant === 'primary' ? 'bg-blue-600 text-white' : 'border bg-white dark:bg-slate-800',
  ].join(' '),
)
</script>
