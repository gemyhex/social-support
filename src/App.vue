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
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const layoutComponent = computed(() => route.meta?.layout || 'div')
</script>

<style>
.app-skeleton {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
