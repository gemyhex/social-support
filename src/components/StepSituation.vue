<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">{{ t('step.3') }}</h2>

    <Form
      :validation-schema="schema"
      :initial-values="initialValues"
      v-slot="{ setFieldValue, setFieldTouched, validate, values }"
    >
      <!-- register setFieldValue during render once -->
      <div v-if="registerSetFieldValueOnce(setFieldValue)" style="display: none"></div>

      <div class="space-y-4">
        <div>
          <FieldItem
            name="currentFinancialSituation"
            :label="t('fields.currentFinancialSituation')"
            type="textarea"
            :rows="5"
          />
          <div class="mt-2">
            <BaseButton
              variant="secondary"
              size="sm"
              @click.prevent="openHelp('currentFinancialSituation')"
              >{{ t('help_me_write') }}</BaseButton
            >
          </div>
        </div>

        <div>
          <FieldItem
            name="employmentCircumstances"
            :label="t('fields.employmentCircumstances')"
            type="textarea"
            :rows="4"
          />
          <div class="mt-2">
            <BaseButton
              variant="secondary"
              size="sm"
              @click.prevent="openHelp('employmentCircumstances')"
              >{{ t('help_me_write') }}</BaseButton
            >
          </div>
        </div>

        <div>
          <FieldItem
            name="reasonForApplying"
            :label="t('fields.reasonForApplying')"
            type="textarea"
            :rows="5"
          />
          <div class="mt-2">
            <BaseButton
              variant="secondary"
              size="sm"
              @click.prevent="openHelp('reasonForApplying')"
              >{{ t('help_me_write') }}</BaseButton
            >
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import { useFormStore } from '@/stores/useFormStore'
import { useI18n } from 'vue-i18n'
import { defineExpose } from 'vue'
import { useApplySuggestion } from '@/composables/useApplySuggestion'

import FieldItem from '@/components/FieldRow.vue'
import BaseButton from '@/components/BaseButton.vue'

const store = useFormStore()
const { t } = useI18n()

const initialValues = {
  currentFinancialSituation: store.form.currentFinancialSituation ?? '',
  employmentCircumstances: store.form.employmentCircumstances ?? '',
  reasonForApplying: store.form.reasonForApplying ?? '',
}

const schema = yup.object({
  currentFinancialSituation: yup
    .string()
    .min(10, t('errors.moreDetail'))
    .required(t('errors.required')),
  employmentCircumstances: yup.string().min(5, t('errors.moreDetail')).nullable(),
  reasonForApplying: yup.string().min(10, t('errors.moreDetail')).required(t('errors.required')),
})

/* wizard validation capture (we keep simple) */
const validateRef = ref<null | (() => Promise<any>)>(null)
const valuesRef = ref<Record<string, any>>({})
const setFieldTouchedRef = ref<null | ((name: string, touched: boolean) => void)>(null)

defineExpose({
  validateStep: async () => {
    if (!validateRef.value) return false
    const res = await validateRef.value()
    const isValid = res && typeof res === 'object' && 'valid' in res ? res.valid : Boolean(res)

    try {
      Object.assign(store.form, valuesRef.value ?? {})
    } catch {}

    if (!isValid) {
      if (setFieldTouchedRef.value && valuesRef.value) {
        Object.keys(valuesRef.value).forEach((k) => {
          try {
            setFieldTouchedRef.value!(k, true)
          } catch {}
        })
      }
      return false
    }
    return true
  },
})

/* use composable (start it now, register setFieldValue when available) */
const { registerSetFieldValue } = useApplySuggestion(store)
let registered = false

function registerSetFieldValueOnce(setFieldValue: any) {
  if (registered) return false
  if (typeof setFieldValue === 'function') {
    registerSetFieldValue(setFieldValue)
    registered = true
    console.info('[StepSituation] registered setFieldValue with useApplySuggestion')
  } else {
    console.warn('[StepSituation] setFieldValue not ready yet')
  }
  return false
}

function openHelp(fieldName: string) {
  const current = (store.form as any)[fieldName] || ''
  const labelMap: Record<string, string> = {
    currentFinancialSituation: t('fields.currentFinancialSituation'),
    employmentCircumstances: t('fields.employmentCircumstances'),
    reasonForApplying: t('fields.reasonForApplying'),
  }
  const label = labelMap[fieldName] ?? fieldName
  const promptText = t('ai.prompts.suggestionTemplate', { field: label, current })
  console.log('[StepSituation] dispatch open-help', { field: fieldName })
  window.dispatchEvent(
    new CustomEvent('open-help', { detail: { field: fieldName, prompt: promptText } }),
  )
}
</script>

<style scoped>
/* small layout polish */
</style>
