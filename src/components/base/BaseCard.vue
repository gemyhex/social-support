<template>
  <div
    :class="[
      'rounded-xl border p-6 shadow-sm transition-all duration-150 glass',
      disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md bg-white dark:bg-slate-900',
    ]"
    role="group"
    :aria-disabled="disabled"
  >
    <template v-if="!hasDefaultSlot">
      <div class="flex items-start gap-4">
        <div
          v-if="hasIcon"
          class="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 shrink-0"
        >
          <slot name="icon">
            <svg
              class="w-6 h-6 text-slate-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </slot>
        </div>

        <div class="flex-1">
          <h3 v-if="title" class="text-lg font-semibold">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-slate-500 mt-1">{{ subtitle }}</p>
        </div>
      </div>
    </template>

    <!-- Slot-only mode (when default slot is provided) -->
    <template v-else>
      <slot></slot>
    </template>

    <div class="mt-4">
      <template v-if="hasActionsSlot">
        <slot name="actions"></slot>
      </template>

      <template v-else-if="hasAction">
        <div class="flex items-center gap-3">
          <BaseButton
            :disabled="disabled"
            @click="onClick"
            :title="actionLabel"
            size="full"
            type="button"
          >
            {{ actionLabel }}
          </BaseButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  actionLabel: { type: String, default: 'Open' },
  disabled: { type: Boolean, default: false },
  hasIcon: { type: Boolean, default: false },
  hasAction: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const slots = useSlots()
const hasDefaultSlot = !!slots.default
const hasActionsSlot = !!slots.actions

function onClick() {
  if (props.disabled) return
  emit('click')
}
</script>
