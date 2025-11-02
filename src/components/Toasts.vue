<!-- src/components/Toasts.vue -->
<template>
  <div aria-live="polite" class="fixed top-4 right-4 z-50 w-full max-w-xs pointer-events-none">
    <transition-group name="toast" tag="div" class="flex flex-col gap-3">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto rounded-lg px-4 py-3 shadow-md max-w-xs break-words"
        :class="containerClass(t.type)"
        role="status"
      >
        <div class="flex items-start gap-3">
          <div class="flex-1 text-sm" v-text="t.message"></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'

const state = useToast()

const toasts = computed(() => state.list)

function containerClass(type: string | undefined) {
  switch (type) {
    case 'success':
      return 'bg-white border border-green-200 text-green-800 dark:bg-slate-800 dark:text-green-200'
    case 'error':
      return 'bg-white border border-red-200 text-red-800 dark:bg-slate-800 dark:text-red-200'
    default:
      return 'bg-white border border-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
  }
}
</script>

<style scoped>
.toast-enter-from {
  transform: translateY(-6px);
  opacity: 0;
}
.toast-enter-active {
  transition: all 180ms ease;
}
.toast-leave-to {
  transform: translateY(-6px);
  opacity: 0;
}
</style>
