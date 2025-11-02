<template>
  <div :class="['w-full', { 'sm:col-span-2': fullWidth }]">
    <label
      v-if="label"
      :for="name"
      class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
    >
      {{ label }}
    </label>

    <component
      :is="inputComponent"
      :id="name"
      v-model="localValue"
      :type="inputType"
      :rows="rows"
      :options="options"
      :placeholder="placeholder"
      :aria-invalid="!!errorMessage"
      @blur="markTouched"
    />

    <p v-if="errorMessage" class="mt-1 text-xs text-red-600" role="alert">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch, computed } from 'vue'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'
import BaseTextarea from './BaseTextarea.vue'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  inputType: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 3 },
  options: { type: Array, default: () => [] },
  fullWidth: { type: Boolean, default: false },
})

const formApi = inject<any>('formApi', null)
const localValue = ref(formApi?.values?.[props.name] ?? '')

// sync from form to local
if (formApi?.values) {
  watch(
    () => formApi.values[props.name],
    (val) => (localValue.value = val),
    { immediate: true },
  )
}

// sync from local to form
watch(localValue, (val) => {
  if (formApi?.setFieldValue) formApi.setFieldValue(props.name, val)
})

const errorMessage = computed(() => {
  const val = formApi?.errors?.[props.name]
  if (!val) return ''
  return Array.isArray(val) ? val[0] : String(val)
})

function markTouched() {
  formApi?.setFieldTouched?.(props.name, true)
}

const inputComponent = computed(() => {
  if (props.type === 'select') return BaseSelect
  if (props.type === 'textarea') return BaseTextarea
  return BaseInput
})

const inputType = computed(() => props.inputType || props.type)
</script>
