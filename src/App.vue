<template>
  <component :is="Layout" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const layouts: Record<string, any> = {
  default: DefaultLayout,
}

const route = useRoute()
const layoutName = computed(() => (route.meta?.layout as string) || 'default')
const Layout = computed(() => layouts[layoutName.value] || DefaultLayout)
</script>
