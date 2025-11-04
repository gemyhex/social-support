<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">{{ t('steps.situation') }}</h2>

    <BaseForm :fields="fields" :columns="1">
      <template #field-action="{ fieldName }">
        <BaseButton
          v-if="helpFields.includes(fieldName)"
          class="mt-2"
          variant="secondary"
          size="sm"
          type="button"
          @click="openHelp(fieldName)"
        >
          {{ t('buttons.helpMeWrite') }}
        </BaseButton>
      </template>
    </BaseForm>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/useFormStore'
import { useDynamicForm } from '@/composables/useForm'
import { useApplySuggestion } from '@/composables/useApplySuggestion'
import { defineExpose } from 'vue'

const store = useFormStore()
const { t } = useI18n()

const fields = [
  {
    name: 'currentFinancialSituation',
    label: t('fields.currentFinancialSituation'),
    type: 'textarea',
    rows: 5,
  },
  {
    name: 'employmentCircumstances',
    label: t('fields.employmentCircumstances'),
    type: 'textarea',
    rows: 5,
  },
  { name: 'reasonForApplying', label: t('fields.reasonForApplying'), type: 'textarea', rows: 5 },
]

const initialValues = {
  currentFinancialSituation: store.storage.draft.currentFinancialSituation ?? '',
  employmentCircumstances: store.storage.draft.employmentCircumstances ?? '',
  reasonForApplying: store.storage.draft.reasonForApplying ?? '',
}

const schema = yup.object({
  currentFinancialSituation: yup
    .string()
    .min(10, t('validation.moreDetail'))
    .required(t('validation.required')),
  employmentCircumstances: yup.string().min(5, t('validation.moreDetail')).nullable(),
  reasonForApplying: yup
    .string()
    .min(10, t('validation.moreDetail'))
    .required(t('validation.required')),
})

const { validateStep, values, setFieldValue } = useDynamicForm({
  validationSchema: schema,
  initialValues,
})

const { registerSetFieldValue } = useApplySuggestion(store)
if (typeof setFieldValue === 'function') registerSetFieldValue(setFieldValue)

watch(
  values,
  (newVal) => {
    if (!newVal) return
    Object.keys(store.storage.draft).forEach((key) => {
      if (newVal[key] !== undefined) store.storage.draft[key] = newVal[key]
    })
  },
  { deep: true, immediate: true },
)

defineExpose({ validateStep })

const helpFields = ['currentFinancialSituation', 'employmentCircumstances', 'reasonForApplying']

function openHelp(fieldName: string) {
  const current = (store.storage.draft as any)[fieldName] || ''
  const labelMap: Record<string, string> = {
    currentFinancialSituation: t('fields.currentFinancialSituation'),
    employmentCircumstances: t('fields.employmentCircumstances'),
    reasonForApplying: t('fields.reasonForApplying'),
  }
  const label = labelMap[fieldName] ?? fieldName
  const promptText = t('ai.prompts.suggestionTemplate', { field: label, current })
  window.dispatchEvent(
    new CustomEvent('open-help', { detail: { field: fieldName, prompt: promptText } }),
  )
}
</script>
