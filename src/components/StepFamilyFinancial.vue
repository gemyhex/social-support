<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">{{ t('step.2') }}</h2>

    <Form
      :validation-schema="schema"
      :initial-values="initialValues"
      v-slot="{ validate, values, setFieldTouched }"
    >
      <!-- capture validate, values and setFieldTouched -->
      <div v-if="capture(validate, values, setFieldTouched)" style="display: none"></div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldRow
          name="maritalStatus"
          :label="t('fields.maritalStatus')"
          type="select"
          :options="maritalOptions"
        />
        <FieldRow name="dependents" :label="t('fields.dependents')" type="number" />
        <FieldRow
          name="employmentStatus"
          :label="t('fields.employmentStatus')"
          type="select"
          :options="employmentOptions"
        />
        <FieldRow name="monthlyIncome" :label="t('fields.monthlyIncome')" type="number" />
        <FieldRow
          name="housingStatus"
          :label="t('fields.housingStatus')"
          type="select"
          :options="housingOptions"
          fullWidth
        />
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
import FieldRow from '@/components/FieldRow.vue'
import { defineExpose } from 'vue'

const store = useFormStore()
const { t } = useI18n()

const initialValues = {
  maritalStatus: store.form.maritalStatus ?? '',
  dependents: store.form.dependents ?? 0,
  employmentStatus: store.form.employmentStatus ?? '',
  monthlyIncome: store.form.monthlyIncome ?? null,
  housingStatus: store.form.housingStatus ?? '',
}

const maritalOptions = [
  { label: t('options.select'), value: '' },
  { label: t('options.marital.single'), value: 'single' },
  { label: t('options.marital.married'), value: 'married' },
  { label: t('options.marital.divorced'), value: 'divorced' },
]

const employmentOptions = [
  { label: t('options.select'), value: '' },
  { label: t('options.employment.unemployed'), value: 'unemployed' },
  { label: t('options.employment.employed'), value: 'employed' },
  { label: t('options.employment.selfEmployed'), value: 'self-employed' },
]

const housingOptions = [
  { label: t('options.select'), value: '' },
  { label: t('options.housing.own'), value: 'own' },
  { label: t('options.housing.rent'), value: 'rent' },
  { label: t('options.housing.livingWithFamily'), value: 'living_with_family' },
  { label: t('options.housing.homeless'), value: 'homeless' },
]

const schema = yup.object({
  maritalStatus: yup.string().required(t('errors.maritalRequired')),
  dependents: yup.number().min(0, t('errors.invalidDependents')).nullable(),
  employmentStatus: yup.string().required(t('errors.employmentRequired')),
  monthlyIncome: yup.number().nullable(),
  housingStatus: yup.string().required(t('errors.housingRequired')),
})

/* ----- capture function & refs ----- */
const validateRef = ref<null | (() => Promise<any>)>(null)
const valuesRef = ref<Record<string, any>>({})
const setFieldTouchedRef = ref<null | ((name: string, touched: boolean) => void)>(null)

function capture(validateFn: any, values: any, setFieldTouched?: any) {
  validateRef.value = validateFn
  valuesRef.value = values
  if (typeof setFieldTouched === 'function') setFieldTouchedRef.value = setFieldTouched
  return false
}

/* expose validateStep: validates, marks touched on failure, syncs store */
defineExpose({
  validateStep: async () => {
    if (!validateRef.value) return false
    const res = await validateRef.value()
    const isValid = res && typeof res === 'object' && 'valid' in res ? res.valid : Boolean(res)

    // sync values to store regardless
    Object.assign(store.form, valuesRef.value ?? {})

    if (!isValid) {
      // mark all fields touched so errors become visible
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
</script>
