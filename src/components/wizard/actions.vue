<template>
  <div class="flex items-center justify-between mt-4">
    <div>
      <BaseButton
        v-if="step > 1"
        variant="secondary"
        size="lg"
        :disabled="loading"
        type="button"
        @click="emitBack"
        aria-label="Back"
      >
        {{ t('buttons.back') }}
      </BaseButton>
    </div>

    <div class="flex items-center gap-2">
      <BaseButton
        v-if="step === stepsCount"
        variant="secondary"
        size="lg"
        :disabled="loading"
        type="button"
        @click="emitSave"
        aria-label="Save"
      >
        {{ t('buttons.save') }}
      </BaseButton>

      <BaseButton
        v-if="!isLast"
        variant="primary"
        size="lg"
        :disabled="loading"
        type="button"
        @click="emitNext"
        aria-label="Next"
      >
        {{ t('buttons.next') }}
      </BaseButton>

      <BaseButton
        v-else
        variant="primary"
        size="lg"
        :disabled="loading"
        type="button"
        @click="emitSubmit"
        aria-label="Submit"
      >
        {{ t('buttons.submit') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  step: { type: Number, required: true },
  stepsCount: { type: Number, default: 3 },
  loading: { type: Boolean, default: false },
})

const emits = defineEmits(['next', 'back', 'submit', 'save'])

const isLast = computed(() => props.step >= props.stepsCount)

function emitNext() {
  if (props.loading) return
  emits('next')
}
function emitBack() {
  if (props.loading) return
  emits('back')
}
function emitSubmit() {
  if (props.loading) return
  emits('submit')
}
function emitSave() {
  if (props.loading) return
  emits('save')
}
</script>

<style scoped>
@media (max-width: 420px) {
  .flex.items-center.gap-2 > .btn-primary,
  .flex.items-center.gap-2 > .btn-secondary {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
