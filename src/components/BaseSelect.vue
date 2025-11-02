<template>
  <div>
    <select
      :id="id"
      :value="modelValue"
      v-bind="cleanAttrs"
      :class="baseClass"
      @change="onChange"
      @blur="onBlur"
    >
      <option value="" disabled v-if="placeholder">{{ t(placeholder) || placeholder }}</option>
      <option v-for="(o, idx) in options" :key="idx" :value="o.value">{{ o.label }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const attrs = useAttrs()
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  id: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'blur'])

const cleanAttrs = computed(() => {
  const copy = { ...attrs } as Record<string, any>
  delete copy['onUpdate:modelValue']
  return copy
})

const baseClass =
  'block w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'

function onChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  emit('update:modelValue', v)
}
function onBlur(e: Event) {
  emit('blur', e)
}
</script>
