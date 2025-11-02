import { defineStore } from 'pinia'
import { reactive, toRefs, watch } from 'vue'

const STORAGE_KEY = 'social_application'

export const useFormStore = defineStore('form', () => {
  const state = reactive({
    activeStep: 1,
    loading: false,
    form: {
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
    } as Record<string, any>,
  })

  watch(
    () => state.form,
    (v) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
      } catch (e) {
        // ignore
      }
    },
    { deep: true },
  )

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) Object.assign(state.form, JSON.parse(raw))
  } catch (e) {
    // ignore
  }

  function setField(name: string, value: any) {
    state.form[name] = value
  }

  function setFields(values: Record<string, any>) {
    Object.entries(values || {}).forEach(([k, v]) => {
      state.form[k] = v
    })
  }

  function manualSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.form))
    } catch (e) { }
  }

  function reset() {
    Object.assign(state.form, {
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
    state.activeStep = 1
    manualSave()
  }

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

  async function submit(validateFn?: (() => Promise<any>) | undefined) {
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
      reset()
      return true
    } finally {
      state.loading = false
    }
  }

  // IMPORTANT: return reactive refs, not copies
  return {
    ...toRefs(state),
    setField,
    setFields,
    manualSave,
    reset,
    validateAndNext,
    back,
    submit,
  }
})
