<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">{{ t('step.1') }}</h2>

    <!-- Presentational form renderer (renders Field -> Base*). Validation is handled by useDynamicForm. -->
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

/* initial values (defensive defaults) */
const initialValues = {
  name: store.form.name ?? '',
  nationalId: store.form.nationalId ?? '',
  dob: store.form.dob ?? '',
  gender: store.form.gender ?? '', // important: default to '' so select is empty
  address: store.form.address ?? '',
  city: store.form.city ?? '',
  state: store.form.state ?? '',
  country: store.form.country ?? '',
  phone: store.form.phone ?? '',
  email: store.form.email ?? '',
}

/* options - no empty option here because BaseSelect will render placeholder blank option */
const genderOptions = [
  { label: t('options.gender.male'), value: 'male' },
  { label: t('options.gender.female'), value: 'female' },
]

/* fields schema for BaseForm (add placeholder for selects to be explicit) */
const fields = [
  { name: 'name', label: t('fields.name'), type: 'text' },
  { name: 'nationalId', label: t('fields.nationalId'), type: 'text' },
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

/* validation schema (Yup). required() treats '' as empty for strings -> triggers error */
const schema = yup.object({
  name: yup.string().required(t('errors.nameRequired')),
  nationalId: yup.string().required(t('errors.nationalIdRequired')),
  dob: yup.string().required(t('errors.dobRequired')),
  gender: yup.string().required(t('errors.genderRequired')),
  address: yup.string().required(t('errors.addressRequired')),
  city: yup.string().required(t('errors.cityRequired')),
  country: yup.string().required(t('errors.countryRequired')),
  email: yup.string().required(t('errors.emailRequired')).email(t('errors.invalidEmail')),
})

/* Use the composable to get validateStep(), values, errors, etc. */
const { validateStep, values } = useDynamicForm({ validationSchema: schema, initialValues })

/* keep Pinia store synced as user types (immediate + deep) */
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

/* expose validateStep to parent wizard via stepRef */
defineExpose({ validateStep })
</script>
