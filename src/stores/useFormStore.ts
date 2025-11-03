import { defineStore } from 'pinia'
import { reactive, toRefs, watch, computed } from 'vue'

const STORAGE_KEY = 'social_application'

type FormShape = Record<string, any>

const defaultForm = (): FormShape => ({
  name: '',
  nationalId: '',
  dob: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: '',
  phone: '',
  email: '',
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: null,
  housingStatus: '',
  currentFinancialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: '',
})

export const useFormStore = defineStore('form', () => {
  const state = reactive({
    activeStep: 1,
    loading: false,
    storage: {
      draft: defaultForm(),
      submitted: null as FormShape | null,
      submittedAt: null as string | null,
    },
  })

  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    const parsed = JSON.parse(raw)
    if (parsed?.draft) state.storage.draft = { ...defaultForm(), ...parsed.draft }
    if (parsed?.submitted) state.storage.submitted = parsed.submitted
    if (parsed?.submittedAt) state.storage.submittedAt = parsed.submittedAt
  }


  watch(
    () => state.storage,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  // -------------------------
  // helpers for form editing
  // -------------------------
  function setField(name: string, value: any) {
    state.storage.draft[name] = value
  }

  function setFields(values: FormShape) {
    Object.entries(values || {}).forEach(([k, v]) => {
      state.storage.draft[k] = v
    })
  }

  function manualSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.storage))
  }

  function resetDraft() {
    state.storage.draft = defaultForm()
    state.activeStep = 1
    manualSave()
  }

  // -------------------------
  // submission helpers
  // -------------------------
  const hasSubmission = computed(() => state.storage.submitted !== null)

  function saveSubmissionSnapshot() {
    state.storage.submitted = { ...state.storage.draft }
    const now = new Date().toISOString()
    state.storage.submittedAt = now
    manualSave()
  }

  function loadSubmissionIntoForm() {
    try {
      if (!state.storage.submitted) return false
      state.storage.draft = { ...defaultForm(), ...state.storage.submitted }
      manualSave()
      return true
    } catch (e) {
      return false
    }
  }

  function clearSubmission() {
    state.storage.submitted = null
    state.storage.submittedAt = null
    manualSave()
  }

  // -------------------------
  // navigation & validation
  // -------------------------
  async function validateAndNext(validateFn?: (() => Promise<any>) | undefined, maxStep = 3) {
    if (state.loading) return false
    state.loading = true
    try {
      if (typeof validateFn === 'function') {
        let ok = false
        try {
          const res = await validateFn()
          ok = !!(res && typeof res === 'object' && 'valid' in res ? res.valid : res)
        } catch (e) {
          ok = false
        }
        if (!ok) return false
      }
      state.activeStep = Math.min(maxStep, state.activeStep + 1)
      return true
    } finally {
      state.loading = false
    }
  }

  function back() {
    if (state.loading) return
    if (state.activeStep > 1) state.activeStep--
  }

  async function submit(validateFn?: (() => Promise<any>) | undefined, options?: { clearDraftAfterSubmit?: boolean }) {
    if (state.loading) return false
    state.loading = true
    try {
      if (typeof validateFn === 'function') {
        let ok = false
        try {
          const res = await validateFn()
          ok = !!(res && typeof res === 'object' && 'valid' in res ? res.valid : res)
        } catch (e) {
          ok = false
        }
        if (!ok) return false
      }

      // persist submitted snapshot
      saveSubmissionSnapshot()

      if (options?.clearDraftAfterSubmit ?? true) {
        // default: clear draft to empty after submit
        resetDraft()
      }

      return true
    } finally {
      state.loading = false
    }
  }

  return {
    ...toRefs(state),
    // helpers
    setField,
    setFields,
    manualSave,
    resetDraft,

    // submission
    saveSubmissionSnapshot,
    loadSubmissionIntoForm,
    clearSubmission,
    hasSubmission,

    // navigation
    validateAndNext,
    back,
    submit,
  }
})
