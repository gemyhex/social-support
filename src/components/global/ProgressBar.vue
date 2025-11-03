<template>
  <div
    role="progressbar"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
    class="w-full bg-slate-200 rounded h-2 overflow-hidden"
  >
    <div :style="{ width: percent + '%' }" class="h-2 bg-blue-600 transition-all"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  step: { type: Number, required: true },
  steps: { type: Number, default: 1 },
})
const percent = computed(() => {
  if (props.steps <= 1) return 100
  return Math.round((props.step / props.steps) * 100)
})
</script>
