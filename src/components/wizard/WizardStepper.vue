<template>
  <div class="flex items-center gap-3 mb-4">
    <template v-for="(label, idx) in labels" :key="idx">
      <div class="flex items-center gap-3">
        <div :class="stepClass(idx + 1)">{{ idx + 1 }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-300">{{ label }}</div>
      </div>
      <div
        v-if="idx < labels.length - 1"
        class="flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-2"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ step: number; labels: string[] }>()
function stepClass(n: number) {
  const base = 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold'
  if (n < props.step) return base + ' bg-slate-200 dark:bg-slate-700 text-slate-800'
  if (n === props.step) return base + ' bg-blue-600 text-white'
  return base + ' bg-white dark:bg-slate-800 text-slate-500 border'
}
</script>
