<template>
  <section class="w-full max-w-3xl mx-auto">
    <BaseCard>
      <template #default>
        <ProgressBar
          :step="formStore.activeStep"
          :steps="steps.length"
          :isValid="isCurrentStepValid"
          class="mb-4"
        />

        <WizardStepper
          :step="formStore.activeStep"
          :labels="stepLabels"
          :valid-steps="validSteps"
        />

        <component
          :is="currentStep.component"
          :key="formStore.activeStep"
          ref="stepRef"
          class="mt-4"
        />
      </template>

      <template #actions>
        <WizardNav
          class="mt-4"
          :step="formStore.activeStep"
          :loading="formStore.loading || loadingLocal"
          :steps-count="steps.length"
          @next="onNext"
          @back="onBack"
          @submit="onSubmit"
          @save="onSave"
        />
      </template>
    </BaseCard>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/useFormStore'
import StepPersonal from '@/components/pages/application/StepPersonal.vue'
import StepFamilyFinancial from '@/components/pages/application/StepFamilyFinancial.vue'
import StepSituation from '@/components/pages/application/StepSituation.vue'
import { useToast } from '@/composables/useToast'
import router from '@/router'

const { t } = useI18n()
const formStore = useFormStore()
const toast = useToast()

const stepRef = ref<any>(null)
const loadingLocal = ref(false)

const steps = [
  { id: 1, component: StepPersonal, labelKey: 'steps.personal' },
  { id: 2, component: StepFamilyFinancial, labelKey: 'steps.family' },
  { id: 3, component: StepSituation, labelKey: 'steps.situation' },
]
const validSteps = ref<boolean[]>(steps.map(() => false))
const stepLabels = computed(() => steps.map((s) => t(s.labelKey)))
const currentStep = computed(() => steps.find((s) => s.id === formStore.activeStep) ?? steps[0])

// check current step validity
const isCurrentStepValid = ref(false)
// Revalidate the active step whenever form values change

watch(
  () => formStore.storage.draft,
  async () => {
    const validate = stepRef.value?.validateStep
    if (typeof validate === 'function') {
      try {
        const result = await validate()
        validSteps.value[formStore.activeStep - 1] = !!(result?.valid ?? result)
        isCurrentStepValid.value = !!(result?.valid ?? result)
      } catch {
        validSteps.value[formStore.activeStep - 1] = false
        isCurrentStepValid.value = false
      }
    }
  },
  { deep: true, immediate: true },
)

// 🔹 also validate again when user switches steps
watch(
  () => formStore.activeStep,
  async () => {
    const validate = stepRef.value?.validateStep
    if (typeof validate === 'function') {
      try {
        const result = await validate()
        validSteps.value[formStore.activeStep - 1] = !!(result?.valid ?? result)
      } catch {
        validSteps.value[formStore.activeStep - 1] = false
      }
    }
  },
)

async function onNext() {
  const validate = stepRef.value?.validateStep
  await formStore.validateAndNext(validate, steps.length)
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
      return
    }
    toast.push(t('messages.submitted') ?? 'Submitted', 'success', 1800)
    router.push({ name: 'Home' })
  } finally {
    loadingLocal.value = false
  }
}

function onSave() {
  formStore.manualSave()
  toast.push(t('messages.saved') ?? 'Saved', 'success', 1200)
}
</script>
