<template>
  <div
    class="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
  >
    <!-- Global header -->
    <AppHeader />

    <!-- Main content area with suspense for async pages -->
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <!-- small, pleasant skeleton while pages load -->
            <div class="w-full max-w-3xl mx-auto p-8">
              <div
                class="animate-pulse h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-3"
              ></div>
              <div class="h-48 bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
          </template>
        </Suspense>
      </router-view>
    </main>

    <!-- Global overlays / utilities -->
    <Toasts />
    <HelpMeWriteModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'

const { locale } = useI18n()
const toast = useToast()

watchEffect(() => {
  const isRTL = locale.value === 'ar'
  document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
})

// Network status toasts (single registration)
function handleOnline() {
  toast.push('You are back online', 'success', 1800)
}
function handleOffline() {
  toast.push('You are offline', 'error', 3500)
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
