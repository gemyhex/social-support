<template>
  <div :class="rowClass">
    <Field :name="name" v-slot="{ field, meta }">
      <component
        v-if="isInputType(type)"
        :is="BaseInput"
        v-bind="{ ...field, 'data-name': name }"
        :label="label"
        :type="inputType ?? 'text'"
        :placeholder="placeholder"
        :clearable="clearable"
        :id="id || name"
      />
      <BaseTextarea
        v-else-if="type === 'textarea'"
        v-bind="{ ...field, 'data-name': name }"
        :label="label"
        :placeholder="placeholder"
        :rows="rows ?? 4"
        :id="id || name"
      />
      <BaseSelect
        v-else-if="type === 'select'"
        v-bind="{ ...field, 'data-name': name }"
        :label="label"
        :options="options || []"
        :placeholder="placeholder"
        :id="id || name"
      />
    </Field>

    <ErrorMessage :name="name" v-slot="{ message }">
      <p v-if="message" class="text-xs text-red-500 mt-1">{{ message }}</p>
    </ErrorMessage>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Field, ErrorMessage } from 'vee-validate'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  inputType: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  fullWidth: { type: Boolean, default: false },
  rows: { type: Number, default: 4 },
  id: { type: String, default: '' },
  clearable: { type: Boolean, default: false },
})

const rowClass = computed(() => (props.fullWidth ? 'col-span-1 sm:col-span-2' : ''))
function isInputType(t?: string) {
  return !t || ['text', 'number', 'email', 'date', 'password'].includes(t)
}
</script>
