<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">{{ t('step.1') }}</h2>

    <Form :validation-schema="schema" :initial-values="initialValues" v-slot="{ validate, values }">
      <!-- capture validate & values into refs (no globals) -->
      <div v-if="capture(validate, values)" style="display: none"></div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field name="name" :label="t('fields.name')" />
        <Field name="nationalId" :label="t('fields.nationalId')" />
        <Field name="dob" :label="t('fields.dob')" type="date" inputType="date" />
        <Field name="gender" :label="t('fields.gender')" type="select" :options="genderOptions" />
        <Field name="address" :label="t('fields.address')" fullWidth />
        <Field name="city" :label="t('fields.city')" />
        <Field name="state" :label="t('fields.state')" />
        <Field name="country" :label="t('fields.country')" />
        <Field name="phone" :label="t('fields.phone')" />
        <Field name="email" :label="t('fields.email')" type="email" inputType="email" />
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useFormStore } from '@/stores/useFormStore'
import { defineExpose } from 'vue'

const { t } = useI18n()
const store = useFormStore()

const initialValues = {
  name: store.form.name ?? '',
  nationalId: store.form.nationalId ?? '',
  dob: store.form.dob ?? '',
  gender: store.form.gender ?? '',
  address: store.form.address ?? '',
  city: store.form.city ?? '',
  state: store.form.state ?? '',
  country: store.form.country ?? '',
  phone: store.form.phone ?? '',
  email: store.form.email ?? '',
}

const genderOptions = [
  { label: t('options.select'), value: '' },
  { label: t('options.gender.male'), value: 'male' },
  { label: t('options.gender.female'), value: 'female' },
  { label: t('options.gender.other'), value: 'other' },
]

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

/* ---- capture validate + values from Form slot ----
   pattern: the Form slot provides validate() and values; we store them in refs
   'capture' is called once per render of the Form slot to register the functions.
*/
const validateRef = ref<null | (() => Promise<any>)>(null)
const valuesRef = ref<Record<string, any>>({})

function capture(validateFn: any, values: any) {
  validateRef.value = validateFn
  valuesRef.value = values
  // return false so the invisible div doesn't render anything visible
  return false
}

/* expose validateStep() so parent (ApplicationForm) can await it */
defineExpose({
  validateStep: async () => {
    if (!validateRef.value) {
      // unexpected — no validate available
      return false
    }
    const res = await validateRef.value()
    // normalize to boolean
    const isValid = res && typeof res === 'object' && 'valid' in res ? res.valid : Boolean(res)
    // sync values into store (autosave)
    Object.assign(store.form, valuesRef.value ?? {})
    return Boolean(isValid)
  },
})
</script>
