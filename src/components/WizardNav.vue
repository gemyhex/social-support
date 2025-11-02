<template>
  <div class="flex items-center justify-between mt-4">
    <!-- Back button (hidden on step 1) -->
    <div>
      <BaseButton
        v-if="step > 1"
        variant="secondary"
        size="sm"
        :disabled="false"
        @click="$emit('back')"
        type="button"
      >
        {{ $t('back') }}
      </BaseButton>
    </div>

    <!-- Right side actions -->
    <div class="flex items-center gap-2">
      <!-- Save only shown on final step -->
      <BaseButton
        v-if="step === 3"
        variant="secondary"
        size="sm"
        @click="$emit('save')"
        type="button"
      >
        {{ $t('save') }}
      </BaseButton>

      <!-- Next (or Submit on final) -->
      <BaseButton
        v-if="step < 3"
        variant="primary"
        size="sm"
        :disabled="loading"
        @click="$emit('next')"
        type="button"
      >
        {{ $t('next') }}
      </BaseButton>

      <BaseButton
        v-else
        variant="primary"
        size="sm"
        :disabled="loading"
        @click="$emit('submit')"
        type="button"
      >
        {{ $t('submit') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import { defineProps } from 'vue'

const props = defineProps({
  step: { type: Number, required: true },
  loading: { type: Boolean, default: false },
})
</script>

<style scoped>
/* keep styles minimal — BaseButton handles visuals */
</style>
