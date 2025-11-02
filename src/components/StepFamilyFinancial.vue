<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">{{ t('step.2') }}</h2>

    <!-- Presentational form renderer -->
    <BaseForm :fields="fields" :schema="schema" :initial-values="initialValues" :columns="2" />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/useFormStore'
import BaseForm from '@/components/BaseForm.vue'
import { useDynamicForm } from '@/composables/useForm'
import { defineExpose } from 'vue'

const { t } = useI18n()
const store = useFormStore()

/* Defensive initial values from Pinia */
const initialValues = {
  maritalStatus: store.form.maritalStatus ?? '',
  dependents: store.form.dependents ?? 0,
  employmentStatus: store.form.employmentStatus ?? '',
  monthlyIncome: store.form.monthlyIncome ?? null,
  housingStatus: store.form.housingStatus ?? '',
}

/* options */
const maritalOptions = [
  { label: t('options.marital.single'), value: 'single' },
  { label: t('options.marital.married'), value: 'married' },
  { label: t('options.marital.divorced'), value: 'divorced' },
]

const employmentOptions = [
  { label: t('options.employment.unemployed'), value: 'unemployed' },
  { label: t('options.employment.employed'), value: 'employed' },
  { label: t('options.employment.selfEmployed'), value: 'self-employed' },
]

const housingOptions = [
  { label: t('options.housing.own'), value: 'own' },
  { label: t('options.housing.rent'), value: 'rent' },
  { label: t('options.housing.livingWithFamily'), value: 'living_with_family' },
  { label: t('options.housing.homeless'), value: 'homeless' },
]

/* fields for BaseForm (presentational) — add placeholder for selects */
const fields = [
  {
    name: 'maritalStatus',
    label: t('fields.maritalStatus'),
    type: 'select',
    options: maritalOptions,
  },
  { name: 'dependents', label: t('fields.dependents'), type: 'number' },
  {
    name: 'employmentStatus',
    label: t('fields.employmentStatus'),
    type: 'select',
    options: employmentOptions,
  },
  { name: 'monthlyIncome', label: t('fields.monthlyIncome'), type: 'number' },
  {
    name: 'housingStatus',
    label: t('fields.housingStatus'),
    type: 'select',
    options: housingOptions,
    fullWidth: true,
  },
]

/* validation schema (Yup) with transforms for numeric fields */
const schema = yup.object({
  maritalStatus: yup.string().required(t('errors.maritalRequired')),
  dependents: yup
    .number()
    .min(0, t('errors.invalidDependents'))
    .nullable()
    .transform((v, o) => (o === '' ? null : v)),
  employmentStatus: yup.string().required(t('errors.employmentRequired')),
  monthlyIncome: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' ? null : v)),
  housingStatus: yup.string().required(t('errors.housingRequired')),
})

/*
 Use the composable that encapsulates useForm().
 It returns { validateStep, values, errors, focusFirstInvalid, ... }.
*/
const { validateStep, values } = useDynamicForm({ validationSchema: schema, initialValues })

/* sync live values into Pinia immediately */
watch(
  values,
  (nv) => {
    if (!nv) return
    Object.keys(store.form).forEach((k) => {
      if (nv[k] !== undefined) store.form[k] = nv[k]
    })
  },
  { deep: true, immediate: true },
)

/* expose validateStep to parent wizard */
defineExpose({ validateStep })
</script>
