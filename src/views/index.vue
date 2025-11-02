<template>
  <section class="w-full max-w-3xl mx-auto">
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-5">
      <WizardStepper :step="formStore.activeStep" :labels="stepLabels" />

      <component
        :is="currentStep.component"
        :key="formStore.activeStep"
        ref="stepRef"
        class="mt-4"
      />

      <WizardNav
        class="mt-4"
        :step="formStore.activeStep"
        :loading="formStore.loading || loadingLocal"
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
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const formStore = useFormStore()
const toast = useToast()
const stepRef = ref<any>(null)

const loadingLocal = ref(false)

const steps = [
  { id: 1, component: StepPersonal, label: t('step.1') },
  { id: 2, component: StepFamilyFinancial, label: t('step.2') },
  { id: 3, component: StepSituation, label: t('step.3') },
]

const stepLabels = computed(() => steps.map((s) => s.label))
const currentStep = computed(() => steps.find((s) => s.id === formStore.activeStep) ?? steps[0])

async function onNext() {
  const validate = stepRef.value?.validateStep
  const ok = await formStore.validateAndNext(validate, steps.length)

  if (!ok) {
    toast.push?.(t('messages.fixErrors') ?? 'Please fix the errors', 'warning', 2000)
  }
}

function onBack() {
  formStore.back()
}

async function onSubmit() {
  if (loadingLocal.value) return
  loadingLocal.value = true
  try {
    const validate = stepRef.value?.validateStep
    const ok = await formStore.submit(validate)
    if (!ok) {
      toast.push?.(t('messages.fixErrors') ?? 'Please fix the errors', 'warning', 1800)
      return
    }
    toast.push?.(t('messages.submitted') ?? 'Submitted', 'success', 1800)
  } finally {
    loadingLocal.value = false
  }
}

function onSave() {
  formStore.manualSave()
  toast.push?.(t('messages.saved') ?? 'Saved', 'success', 1200)
}
</script>
