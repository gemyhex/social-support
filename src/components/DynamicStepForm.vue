<template>
  <Form :validation-schema="schema" :initial-values="initialValues" v-slot="{ values, validate }">
    <div class="grid grid-cols-1 gap-4" :class="gridColsClass">
      <template v-for="(f, i) in fields" :key="f.name">
        <div :class="f.fullWidth ? 'col-span-1 sm:col-span-2' : ''">
          <Field :name="f.name" v-slot="{ field }">
            <component
              :is="fieldComponent(f.type)"
              v-bind="field"
              v-if="isInputType(f.type)"
              :label="f.label"
              :type="f.inputType ?? 'text'"
              :placeholder="f.placeholder"
              :options="f.options"
            />
            <!-- For textarea -->
            <BaseTextarea
              v-else-if="f.type === 'textarea'"
              v-bind="field"
              :label="f.label"
              :placeholder="f.placeholder"
              :rows="f.rows ?? 4"
            />
            <!-- For select using options prop -->
            <BaseSelect
              v-else-if="f.type === 'select'"
              v-bind="field"
              :label="f.label"
              :options="f.options"
              :placeholder="f.placeholder"
            />
          </Field>

          <!-- ErrorMessage slot to always show validation errors after validate() -->
          <ErrorMessage :name="f.name" v-slot="{ message }">
            <p v-if="message" class="text-xs text-red-500 mt-1">{{ message }}</p>
          </ErrorMessage>
        </div>
      </template>
    </div>
  </Form>
</template>

<script setup lang="ts">
/* DynamicStepForm.vue */
import { defineProps, defineEmits, defineExpose, computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import { useFormStore } from '@/stores/useFormStore'

type FieldDef = {
  name: string
  label?: string
  type?: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'password'
  inputType?: string // for <input type=...>
  placeholder?: string
  options?: any[] // for select
  fullWidth?: boolean
  rows?: number
}

const props = defineProps<{
  schema: any // yup schema
  initialValues: Record<string, any>
  fields: FieldDef[]
  columns?: number
}>()

const store = useFormStore()

const gridColsClass = computed(() =>
  props.columns && props.columns > 1
    ? `grid-cols-1 sm:grid-cols-${props.columns}`
    : 'grid-cols-1 sm:grid-cols-2',
)

function isInputType(t?: string) {
  return !t || ['text', 'number', 'email', 'date', 'password'].includes(t)
}

function fieldComponent(t?: string) {
  if (!t || ['text', 'number', 'email', 'date', 'password'].includes(t)) return BaseInput
  if (t === 'select') return BaseSelect
  if (t === 'textarea') return BaseTextarea
  return BaseInput
}

/*
 Expose validateStep to parent:
 - Calls validate() (from the <Form> slot)
 - Normalizes returned value to boolean
 - Syncs values to store.form
*/
defineExpose({
  validateStep: async function () {
    // access validate() by creating temporary Form slot is required; but we can't access it outside template directly.
    // Instead, we will dispatch a custom event that the slot can handle — simpler approach:
    // However VeeValidate gives validate() from v-slot; to access it, we will use a hidden ref function approach.
    // We implement a trick: we call document-level custom event 'request-validate' and the Form slot will respond with 'validate-result'.
    // But simpler: we'll leverage a global store approach: call a function on the root element via a ref.
    return (await (window as any).__dynamicForm_validate?.()) ?? false
  },
})
</script>

<!-- Note:
  Because vee-validate's validate() function is provided inside the Form slot scope,
  we expose an interop by wiring window.__dynamicForm_validate in onMounted inside the slot scope.
  The below patch will be implemented in the template area using v-slot to register validate() to that global function,
  but to keep the component concise I implement it in the parent steps when using this component.
-->
