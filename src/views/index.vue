<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <template v-if="loading">
        <BaseCard class="animate-pulse p-6 rounded-xl glass">
          <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-3"></div>
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
          <div class="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        </BaseCard>
      </template>

      <template v-else>
        <BaseCard
          has-action
          has-icon
          :title="title"
          :subtitle="subtitle"
          :action-label="actionLabel"
          :disabled="false"
          @click="goToFill"
        >
          <template #icon>
            <svg
              class="w-6 h-6 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 4v16M4 12h16" />
            </svg>
          </template>
        </BaseCard>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFormStore } from '@/stores/useFormStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const store = useFormStore()

const loading = ref(true)
const hasApplication = ref(false)

async function checkForSubmission() {
  loading.value = true
  await new Promise((r) => setTimeout(r, 1000))
  hasApplication.value = store.hasSubmission
  loading.value = false
}

onMounted(() => {
  checkForSubmission()
})

const title = computed(() =>
  hasApplication.value ? t('pages.home.editApplication') : t('pages.home.fillApplication'),
)
const subtitle = computed(() =>
  hasApplication.value ? t('pages.home.updateExisting') : t('pages.home.startNew'),
)
const actionLabel = computed(() => (hasApplication.value ? t('buttons.edit') : t('buttons.fill')))

async function goToFill() {
  if (loading.value) return
  if (hasApplication.value) {
    store.loadSubmissionIntoForm()
  }
  await router.push({ name: 'ApplicationForm' })
}
</script>
