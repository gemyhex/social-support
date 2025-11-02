<template>
  <component :is="Layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// Map of layouts you have. Add more as you create them.
const layouts: Record<string, any> = {
  default: DefaultLayout,
}

const route = useRoute()
const layoutName = computed(() => (route.meta?.layout as string) || 'default')
const Layout = computed(() => layouts[layoutName.value] || DefaultLayout)
</script>
