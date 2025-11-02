<template>
  <div id="app">
    <component :is="layoutComponent">
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <div class="w-full max-w-3xl mx-auto p-8">
              <div
                class="animate-pulse h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-3"
              ></div>
              <div class="h-48 bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
          </template>
        </Suspense>
      </router-view>
    </component>
  </div>
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

<style>
.app-skeleton {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
