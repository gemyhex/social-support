<template>
  <section class="w-full max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-lg font-semibold">{{ $t('title') }}</h1>
      <div class="text-sm text-slate-500" aria-live="polite">
        {{ activeStep }} / {{ steps.length }}
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-5">
      <ProgressBar :step="activeStep" :steps="steps.length" class="mb-4" />

      <WizardStepper :step="activeStep" :labels="stepLabels" />

      <component :is="currentStep.component" :key="activeStep" ref="stepRef" class="mt-4" />
    </div>

    <WizardNav
      :step="activeStep"
      :steps-count="steps.length"
      :loading="loading"
      @next="onNext"
      @back="onBack"
      @submit="onSubmit"
      class="mt-4"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFormStore } from '@/stores/useFormStore'
import { useToast } from '@/composables/useToast'

import StepPersonal from './StepPersonal.vue'
import StepFamilyFinancial from './StepFamilyFinancial.vue'
import StepSituation from './StepSituation.vue'

const formStore = useFormStore()
const { push } = useToast()

const stepRef = ref<any>(null)
const loading = ref(false)

const steps = [
  { id: 1, key: 'personal', component: StepPersonal, labelKey: 'step.personal' },
  { id: 2, key: 'family', component: StepFamilyFinancial, labelKey: 'step.family' },
  { id: 3, key: 'situation', component: StepSituation, labelKey: 'step.situation' },
]

const activeStep = computed(() => formStore.activeStep || 1)
const currentStep = computed(() => {
  return steps.find((s) => s.id === activeStep.value) ?? steps[0]
})

const stepLabels = computed(() => steps.map((s) => s.labelKey))

async function onNext() {
  if (!stepRef.value) {
    return
  }

  loading.value = true
  try {
    const ok = await stepRef.value.validateStep?.()
    if (ok) formStore.activeStep = Math.min(formStore.activeStep + 1, steps.length)
  } catch (err) {
    push('An error occurred', 'error', 2500)
  } finally {
    loading.value = false
  }
}

function onBack() {
  formStore.activeStep = Math.max(1, formStore.activeStep - 1)
}

async function onSubmit() {
  if (!stepRef.value) return
  loading.value = true
  try {
    const ok = await stepRef.value.validateStep?.()
    if (!ok) return

    push('Form submitted successfully', 'success', 2000)
    formStore.reset()
  } catch (err) {
    console.error('submit error', err)
    push('Submit failed', 'error', 3000)
  } finally {
    loading.value = false
  }
}
</script>
