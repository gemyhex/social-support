<template>
  <component :is="Layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useToast } from '@/composables/useToast'

const layouts: Record<string, any> = {
  default: DefaultLayout,
}

const route = useRoute()
const layoutName = computed(() => (route.meta?.layout as string) || 'default')
const Layout = computed(() => layouts[layoutName.value] || DefaultLayout)
const toast = useToast()

function handleOnline() {
  toast.push?.('You are back online', 'success', 1800)
}
function handleOffline() {
  toast.push?.('You are offline', 'warning', 3500)
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})
onBeforeUnmount(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>
