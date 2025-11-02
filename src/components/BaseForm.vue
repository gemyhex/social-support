<template>
  <form @submit.prevent>
    <div class="grid gap-4" :class="gridColsClass">
      <template v-for="f in fields" :key="f.name">
        <div :class="colClass(f)">
          <Field :name="f.name" v-slot="{ field, meta }">
            <div>
              <component
                v-if="isInputType(f.type)"
                :is="fieldComponent(f.type)"
                v-bind="{ ...field, 'data-name': f.name }"
                :label="f.label"
                :type="f.inputType ?? f.type ?? 'text'"
                :placeholder="f.placeholder"
                :clearable="f.clearable"
                :id="f.id ?? f.name"
              />

              <BaseTextarea
                v-else-if="f.type === 'textarea'"
                v-bind="{ ...field, 'data-name': f.name }"
                :label="f.label"
                :placeholder="f.placeholder"
                :rows="f.rows ?? 4"
                :id="f.id ?? f.name"
              />

              <BaseSelect
                v-else-if="f.type === 'select'"
                v-bind="{ ...field, 'data-name': f.name }"
                :label="f.label"
                :options="f.options || []"
                :placeholder="f.placeholder"
                :id="f.id ?? f.name"
              />

              <div class="mt-2">
                <slot name="field-action" :field-name="f.name"></slot>
              </div>
            </div>
          </Field>

          <!-- ErrorMessage: reliable display after validate() -->
          <ErrorMessage :name="f.name" v-slot="{ message }">
            <p v-if="message" class="text-xs text-red-500 mt-1">{{ message }}</p>
          </ErrorMessage>
        </div>
      </template>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Field, ErrorMessage } from 'vee-validate'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'

const props = defineProps<{
  fields: Array<Record<string, any>>
  columns?: number
}>()

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

function colClass(f: any) {
  return f.fullWidth ? 'col-span-1 sm:col-span-2' : ''
}
</script>

<style scoped>
/* small layout niceties */
</style>
