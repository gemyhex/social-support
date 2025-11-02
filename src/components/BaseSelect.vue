<template>
  <div class="field-item">
    <label v-if="label" :for="computedId" class="block text-sm font-medium mb-1">{{ label }}</label>

    <select
      :id="computedId"
      v-bind="forwardedAttrs"
      :value="internalValue"
      :multiple="multiple"
      :disabled="disabled"
      :aria-invalid="ariaInvalid"
      :aria-describedby="ariaDescribedBy"
      @change="handleChange"
      ref="selRef"
      class="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-800 dark:text-slate-100"
    >
      <option v-if="placeholder && !multiple" value="">{{ placeholderLabel }}</option>

      <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </option>
    </select>

    <p v-if="errorMsg" class="text-xs text-red-500 mt-1" :id="computedId + '-err'">
      {{ errorMsg }}
    </p>
    <p v-else-if="hint" class="text-xs text-slate-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, ref } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: undefined },
  label: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: null },
  id: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  hint: { type: String, default: '' },
  errorMsg: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])
const attrs = useAttrs()
const selRef = ref<HTMLSelectElement | null>(null)

function uid() {
  return 'select-' + Math.random().toString(36).slice(2, 9)
}
const computedId = computed(() => props.id || uid())

/* Value precedence: Field (attrs.value) > v-model (props.modelValue) */
const internalValue = computed(() => (attrs as any).value ?? props.modelValue)

/* forwardedAttrs: forward everything except event handlers we want to control */
const forwardedAttrs = computed(() => {
  const out: Record<string, any> = {}
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'onInput' || k === 'onChange' || k === 'onUpdate:modelValue') return
    out[k] = v
  })
  return out
})

const ariaInvalid = computed(() => (props.errorMsg ? 'true' : null))
const ariaDescribedBy = computed(() => (props.errorMsg ? computedId.value + '-err' : null))

/* If placeholder is an i18n key (like 'select.placeholder'), prefer using $t if present */
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const placeholderLabel = computed(() => {
  // if placeholder looks like a translation key (no spaces), try translate
  if (typeof props.placeholder === 'string' && props.placeholder.indexOf(' ') === -1) {
    try {
      return t(props.placeholder as string)
    } catch {
      /* fallback */
    }
  }
  return props.placeholder
})

/* handle change: update vee-validate Field by calling its handlers (if passed)
   and emit update:modelValue for v-model usage */
function handleChange(e: Event) {
  const el = e.target as HTMLSelectElement
  const value = props.multiple ? Array.from(el.selectedOptions).map((o) => o.value) : el.value

  // call Field's change handler if provided
  if (typeof (attrs as any).onChange === 'function') (attrs as any).onChange(e)

  // some Field implementations expect onInput instead — call it with a synthetic event
  if (typeof (attrs as any).onInput === 'function') {
    ;(attrs as any).onInput({ target: { value } } as unknown as Event)
  }

  // Emit for v-model usage
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
select:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}
</style>
