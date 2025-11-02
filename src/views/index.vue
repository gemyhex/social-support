<template>
  <section class="w-full max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-lg font-semibold">{{ t('title') }}</h1>
      <div class="text-sm text-slate-500" aria-live="polite">
        {{ formStore.activeStep }} / {{ steps.length }}
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-5">
      <!-- stepper -->
      <WizardStepper :step="formStore.activeStep" :labels="stepLabels" />

      <!-- dynamic step component -->
      <component
        :is="currentStep.component"
        :key="formStore.activeStep"
        ref="stepRef"
        class="mt-4"
      />

      <!-- navigation -->
      <WizardNav
        class="mt-4"
        :step="formStore.activeStep"
        :loading="loading"
        @next="onNext"
        @back="onBack"
        @submit="onSubmit"
        @save="onSave"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/useFormStore'
import StepPersonal from '@/components/StepPersonal.vue'
import StepFamilyFinancial from '@/components/StepFamilyFinancial.vue'
import StepSituation from '@/components/StepSituation.vue'
import WizardNav from '@/components/WizardNav.vue'
import WizardStepper from '@/components/WizardStepper.vue'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const formStore = useFormStore()
const { push } = useToast()

const stepRef = ref<any>(null)
const loading = ref(false)
const advancing = ref(false)

// central steps array (dynamic)
const steps = [
  { id: 1, component: StepPersonal, label: t('step.1') },
  { id: 2, component: StepFamilyFinancial, label: t('step.2') },
  { id: 3, component: StepSituation, label: t('step.3') },
]

const stepLabels = computed(() => steps.map((s) => s.label))
const currentStep = computed(() => steps.find((s) => s.id === formStore.activeStep) ?? steps[0])

// NEXT: validate current step then move forward (mutex + clamp)
async function onNext() {
  if (advancing.value) return
  if (formStore.activeStep >= steps.length) return

  advancing.value = true
  loading.value = true

  try {
    if (stepRef.value?.validateStep) {
      // validateStep must return boolean (true=valid, false=invalid)
      const ok = await stepRef.value.validateStep()
      if (!ok) {
        // validation failed — step is responsible for showing errors
        return
      }
    }

    // re-read and increment safely
    const current = formStore.activeStep
    formStore.activeStep = Math.min(steps.length, current + 1)
  } finally {
    loading.value = false
    advancing.value = false
  }
}

function onBack() {
  if (advancing.value) return
  if (formStore.activeStep > 1) formStore.activeStep--
}

async function onSubmit() {
  if (advancing.value) return
  advancing.value = true
  loading.value = true

  try {
    if (stepRef.value?.validateStep) {
      const ok = await stepRef.value.validateStep()
      if (!ok) return
    }

    // mock submit
    console.log('submit payload', formStore.form)
    push(t('messages.submitted'), 'success', 1800)
    formStore.reset()
  } finally {
    loading.value = false
    advancing.value = false
  }
}

function onSave() {
  formStore.manualSave?.()
  push(t('messages.saved'), 'success', 1200)
}
</script>

<style scoped>
/* small adjustments if you want a tighter layout */
</style>
