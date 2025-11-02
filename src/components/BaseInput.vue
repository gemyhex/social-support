<template>
  <div>
    <input
      ref="el"
      :id="id"
      :type="type"
      :value="modelValue"
      v-bind="cleanAttrs"
      :placeholder="placeholder"
      :class="baseClass"
      @input="onInput"
      @blur="onBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useAttrs } from 'vue'

const attrs = useAttrs()
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  id: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'blur'])

const cleanAttrs = computed(() => {
  const copy = { ...attrs } as Record<string, any>
  // remove v-model specific if any
  delete copy['onUpdate:modelValue']
  return copy
})

const baseClass =
  'block w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
}
function onBlur(e: Event) {
  emit('blur', e)
}
</script>
