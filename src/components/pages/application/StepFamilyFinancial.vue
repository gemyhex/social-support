<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">{{ t('step.2') }}</h2>

    <BaseForm :fields="fields" :schema="schema" :initial-values="initialValues" :columns="2" />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/useFormStore'
import { useDynamicForm } from '@/composables/useForm'
import { defineExpose } from 'vue'

const { t } = useI18n()
const store = useFormStore()

const initialValues = {
  maritalStatus: store.storage.draft.maritalStatus ?? '',
  dependents: store.storage.draft.dependents ?? 0,
  employmentStatus: store.storage.draft.employmentStatus ?? '',
  monthlyIncome: store.storage.draft.monthlyIncome ?? null,
  housingStatus: store.storage.draft.housingStatus ?? '',
}

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

const { validateStep, values } = useDynamicForm({ validationSchema: schema, initialValues })

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
</script>
