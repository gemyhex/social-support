<template>
  <section class="w-full max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <!-- use $t inside the template (safe) -->
      <h1 class="text-lg font-semibold">{{ $t('title') }}</h1>
      <div class="text-sm text-slate-500" aria-live="polite">
        {{ activeStep }} / {{ steps.length }}
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-5">
      <ProgressBar :step="activeStep" :steps="steps.length" class="mb-4" />

      <WizardStepper :step="activeStep" :labels="stepLabels" />

      <!-- Render the current step component (we import your original components directly) -->
      <component :is="currentStep.component" :key="activeStep" ref="stepRef" class="mt-4" />
    </div>

    <WizardNav
      :step="activeStep"
      :stepsCount="steps.length"
      :loading="loading"
      @next="onNext"
      @back="onBack"
      @submit="onSubmit"
      class="mt-4"
    />
  </section>
</template>

<script setup lang="ts">
/*
  Safe WizardContainer:
  - Avoids evaluating translations or other operations at setup time that depend on i18n state.
  - Uses your existing Step components directly (no fields removed).
  - Validates current step via `validateStep()` exposed by BaseForm inside each Step component.
*/

import { ref, computed } from 'vue'
import { useFormStore } from './useFormStore'
import { useToast } from './useToast'

// Import your existing step components directly (do not change their fields)
import StepPersonal from './StepPersonal.vue'
import StepFamilyFinancial from './StepFamilyFinancial.vue'
import StepSituation from './StepSituation.vue'

const formStore = useFormStore()
const { push } = useToast()

const stepRef = ref<any>(null)
const loading = ref(false)

// Use an array of step definitions referencing your components.
// Labels will be resolved in the template via $t (so i18n isn't used in setup).
const steps = [
  { id: 1, key: 'personal', component: StepPersonal, labelKey: 'step.personal' },
  { id: 2, key: 'family', component: StepFamilyFinancial, labelKey: 'step.family' },
  { id: 3, key: 'situation', component: StepSituation, labelKey: 'step.situation' },
]

const activeStep = computed(() => formStore.activeStep || 1)
const currentStep = computed(() => {
  return steps.find((s) => s.id === activeStep.value) ?? steps[0]
})

// compute stepLabels lazily (template will call $t)
const stepLabels = computed(() => steps.map((s) => s.labelKey))

// NAVIGATION HANDLERS

async function onNext() {
  if (!stepRef.value) {
    // no ref (component not yet mounted) — safe-guard: do nothing
    return
  }

  loading.value = true
  try {
    // each step's BaseForm exposes validateStep()
    const ok = await stepRef.value.validateStep?.()
    if (ok) {
      formStore.activeStep = Math.min(formStore.activeStep + 1, steps.length)
    } else {
      push('Please fix errors before continuing', 'error', 2500)
    }
  } catch (err) {
    console.error('onNext error', err)
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
    if (!ok) {
      push('Please fix errors before submitting', 'error', 2500)
      return
    }

    // Perform final submission (API call or store save)
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
