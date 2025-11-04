<template>
  <div class="flex items-center gap-3 mb-4">
    <template v-for="(label, idx) in labels" :key="idx">
      <div class="flex items-center gap-3">
        <div :class="stepCircleClass(idx + 1)">{{ idx + 1 }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-300">{{ label }}</div>
      </div>

      <div
        v-if="idx < labels.length - 1"
        :class="connectorClass(idx + 1)"
        class="flex-1 h-px mx-2"
        aria-hidden="true"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  step: number
  labels: string[]
  validSteps?: boolean[] | null
}>()

/** whether step n is considered valid/completed */
function isStepValid(n: number) {
  if (Array.isArray(props.validSteps)) {
    return Boolean(props.validSteps[n - 1])
  }
  return n < props.step
}

function isCurrent(n: number) {
  return n === props.step
}

function stepCircleClass(n: number) {
  const base =
    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all'
  if (isStepValid(n)) return `${base} bg-green-600 text-white`
  if (isCurrent(n)) return `${base} bg-blue-600 text-white`
  return `${base} bg-white dark:bg-slate-800 text-slate-500 border`
}

/** connector class: green if left step is valid otherwise neutral */
function connectorClass(n: number) {
  return isStepValid(n) ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700'
}
</script>
