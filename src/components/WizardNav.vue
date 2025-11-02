<template>
  <div class="flex items-center justify-between mt-4">
    <BaseButton v-if="step > 1" variant="secondary" size="sm" @click="$emit('back')" type="button">
      {{ $t('back') }}
    </BaseButton>

    <div class="flex items-center gap-2 ml-auto">
      <BaseButton
        v-if="!isLast"
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
import { computed } from 'vue'

const props = defineProps({
  step: { type: Number, required: true },
  stepsCount: { type: Number, required: true },
  loading: { type: Boolean, default: false },
})

const isLast = computed(() => props.step >= props.stepsCount)
</script>
