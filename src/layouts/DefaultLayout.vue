<template>
  <Navbar />
  <router-view />
  <Toasts />
  <HelpMeWriteModal />
</template>

<script setup>
import HelpMeWriteModal from '@/components/HelpMeWriteModal.vue'
import Toasts from '@/components/Toasts.vue'
</script>
