import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';

const STORAGE_KEY = 'ss_application_v1';

export const useFormStore = defineStore('form', () => {
  const state = reactive({
    activeStep: 1,
    form: {
      // step 1
      name: '', nationalId: '', dob: '', gender: '', address: '', city: '', state: '', country: '', phone: '', email: '',
      // step 2
      maritalStatus: '', dependents: 0, employmentStatus: '', monthlyIncome: null, housingStatus: '',
      // step 3
      currentFinancialSituation: '', employmentCircumstances: '', reasonForApplying: ''
    }
  });

  // persist
  watch(() => state.form, (v) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch { }
  }, { deep: true });

  // hydratation
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) Object.assign(state.form, JSON.parse(s));
  } catch { }

  function manualSave() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.form)); } catch { } }
  function reset() {
    Object.assign(state.form, {
      name: '', nationalId: '', dob: '', gender: '', address: '', city: '', state: '', country: '', phone: '', email: '',
      maritalStatus: '', dependents: 0, employmentStatus: '', monthlyIncome: null, housingStatus: '',
      currentFinancialSituation: '', employmentCircumstances: '', reasonForApplying: ''
    }); state.activeStep = 1; manualSave();
  }

  return { ...state, manualSave, reset };
});
