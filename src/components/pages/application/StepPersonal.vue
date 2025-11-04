<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">{{ t('steps.personal') }}</h2>

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
  name: store.storage.draft.name ?? '',
  nationalID: store.storage.draft.nationalID ?? '',
  dob: store.storage.draft.dob ?? '',
  gender: store.storage.draft.gender ?? '',
  address: store.storage.draft.address ?? '',
  city: store.storage.draft.city ?? '',
  state: store.storage.draft.state ?? '',
  country: store.storage.draft.country ?? '',
  phone: store.storage.draft.phone ?? '',
  email: store.storage.draft.email ?? '',
}

const genderOptions = [
  { label: t('options.gender.male'), value: 'male' },
  { label: t('options.gender.female'), value: 'female' },
]

const fields = [
  { name: 'name', label: t('fields.name'), type: 'text' },
  { name: 'nationalID', label: t('fields.nationalID'), type: 'text' },
  { name: 'dob', label: t('fields.dob'), type: 'date', inputType: 'date' },
  {
    name: 'gender',
    label: t('fields.gender'),
    type: 'select',
    options: genderOptions,
  },
  { name: 'address', label: t('fields.address'), type: 'textarea', fullWidth: true, rows: 3 },
  { name: 'city', label: t('fields.city'), type: 'text' },
  { name: 'state', label: t('fields.state'), type: 'text' },
  { name: 'country', label: t('fields.country'), type: 'text' },
  { name: 'phone', label: t('fields.phone'), type: 'text' },
  { name: 'email', label: t('fields.email'), type: 'email', inputType: 'email' },
]

const schema = yup.object({
  name: yup.string().required(t('validation.nameRequired')),
  nationalID: yup.string().required(t('validation.nationalIDRequired')),
  dob: yup.string().required(t('validation.dobRequired')),
  gender: yup.string().required(t('validation.genderRequired')),
  address: yup.string().required(t('validation.addressRequired')),
  city: yup.string().required(t('validation.cityRequired')),
  country: yup.string().required(t('validation.countryRequired')),
  email: yup.string().required(t('validation.emailRequired')).email(t('validation.invalidEmail')),
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
