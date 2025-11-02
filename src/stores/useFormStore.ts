import { defineStore } from 'pinia'
import { reactive, toRefs, watch } from 'vue'

const STORAGE_KEY = 'application_form_v1'

const INITIAL_FORM_STATE = {
  // personal
  name: '',
  nationalId: '',
  dob: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  // family/financial
  maritalStatus: '',
  dependents: 0,
  monthlyIncome: null,
  housingStatus: '',
  // situation
  currentFinancialSituation: '',
  employmentCircumstances: '',
  reasonForApplying: ''
}

export const useFormStore = defineStore('form', () => {
  const state = reactive({
    form: { ...INITIAL_FORM_STATE },
    activeStep: 1
  })

  // hydrate from storage
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) {
      Object.assign(state.form, JSON.parse(s))
    }
  } catch (e) { /* ignore */ }

  // auto-persist (debounce if needed)
  watch(
    () => state.form,
    () => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.form)) } catch { }
    },
    { deep: true }
  )

  function manualSave() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.form)) } catch { }
  }

  function reset() {
    state.form = { ...INITIAL_FORM_STATE }
    state.activeStep = 1
    manualSave()
  }

  return { ...toRefs(state), manualSave, reset }
})
