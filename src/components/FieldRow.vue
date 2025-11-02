<template>
  <div class="field-item">
    <Field :name="name" v-slot="{ field, meta }">
      <label v-if="label" :for="id" class="block text-sm font-medium mb-1">{{ label }}</label>

      <textarea
        v-if="isTextarea"
        v-bind="field"
        :id="id"
        :rows="rows || 4"
        :placeholder="placeholder"
        class="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-800 dark:text-slate-100"
      ></textarea>

      <input
        v-else
        v-bind="field"
        :id="id"
        :type="type"
        :placeholder="placeholder"
        class="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-800 dark:text-slate-100"
      />

      <p v-if="meta.touched && meta.error" class="text-sm text-red-500 mt-1">{{ meta.error }}</p>
    </Field>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Field } from 'vee-validate'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  rows: { type: Number, default: 4 },
  placeholder: { type: String, default: '' },
})

const id = computed(() => `field-${props.name}-${uuidv4().slice(0, 6)}`)
const isTextarea = computed(() => props.type === 'textarea')
</script>

<style scoped>
textarea:focus,
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
}
</style>
