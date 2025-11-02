<template>
  <Form
    @submit="onSubmit"
    :validation-schema="schema"
    :initial-values="initialValues"
    v-slot="{ errors: slotErrors, values: slotValues, meta, isSubmitting }"
  >
    <slot
      v-if="$slots.default"
      :errors="slotErrors"
      :meta="meta"
      :isSubmitting="isSubmitting"
      :values="slotValues"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <template v-for="field in fields" :key="field.name">
        <Field
          :name="field.name"
          :label="field.label"
          :type="field.type"
          :inputType="field.inputType"
          :options="field.options"
          :fullWidth="field.fullWidth"
          :rows="field.rows"
        />
      </template>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { provide, nextTick } from 'vue'
import { useForm, Form } from 'vee-validate'

interface Option {
  label: string
  value: any
}

interface FieldDefinition {
  name: string
  label: string
  type?: string
  inputType?: string
  options?: Option[]
  fullWidth?: boolean
  rows?: number
}

const props = defineProps<{
  schema: any
  initialValues: Record<string, any>
  fields?: FieldDefinition[]
}>()

// setup vee-validate
const { validate, values, setFieldValue, setFieldTouched, errors } = useForm({
  validationSchema: props.schema,
  initialValues: props.initialValues,
})

// provide the form API for fields
const formApi = { values, errors, setFieldValue, setFieldTouched, validate }
provide('formApi', formApi)

// internal submit (won’t be used by wizard directly)
function onSubmit(vals: any) {
  console.log('BaseForm submitted:', vals)
}

// validation method used by wizard
async function validateStep(): Promise<boolean> {
  const result = await validate()
  if (!result.valid) {
    Object.keys(values).forEach((k) => setFieldTouched(k, true))
    await nextTick()
    return false
  }
  return true
}

// expose validation and value-setting API
defineExpose({
  validateStep,
  setFieldValue,
})
</script>
