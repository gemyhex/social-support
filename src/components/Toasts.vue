<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <div v-for="t in toasts" :key="t.id" class="max-w-xs">
      <div :class="toastClass(t.type)" class="p-3 rounded shadow">
        <div class="text-sm">{{ t.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toasts } from '@/composables/useToast'
import { computed } from 'vue'

const toastClass = (type: string | undefined) =>
  type === 'success'
    ? 'bg-emerald-600 text-white'
    : type === 'error'
      ? 'bg-rose-600 text-white'
      : 'bg-slate-800 text-white'
</script>
