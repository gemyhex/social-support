<template>
  <div class="flex items-center justify-between mt-4">
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

    <div class="flex items-center gap-2">
      <BaseButton
        v-if="step === 3"
        variant="secondary"
        size="sm"
        @click="$emit('save')"
        type="button"
      >
        {{ $t('save') }}
      </BaseButton>

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
import { defineProps, computed } from 'vue'

const props = defineProps({
  step: { type: Number, required: true },
  stepsCount: { type: Number, required: true },
  loading: { type: Boolean, default: false },
})

const isLast = computed(() => props.step >= props.stepsCount)
</script>
