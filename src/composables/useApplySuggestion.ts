import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { Store } from 'pinia'

/**
 * useApplySuggestion(store)
 * - returns { registerSetFieldValue } so you can register vee-validate's setFieldValue
 * - listens for 'apply-suggestion' and applies values to setFieldValue + pinia store
 */
export function useApplySuggestion(store: Store<any>) {
  const id = Math.random().toString(36).slice(2, 8)
  const setFieldValueRef = ref<null | ((name: string, value: any) => void)>(null)
  const pending = new Map<string, string>()

  function applyToVee(field: string, text: string) {
    if (setFieldValueRef.value) {
      try {
        console.debug(`[useApplySuggestion:${id}] setFieldValue =>`, field, text)
        setFieldValueRef.value(field, text)
        return true
      } catch (err) {
        console.error(`[useApplySuggestion:${id}] setFieldValue threw`, err)
        return false
      }
    }
    console.debug(`[useApplySuggestion:${id}] setFieldValue not available for`, field)
    return false
  }

  function applyToStore(field: string, text: string) {
    try {
      if (typeof store.$patch === 'function') {
        store.$patch((s: any) => {
          if (!s.form) s.form = {}
          s.form[field] = text
        })
      } else {
        ; (store.form as any)[field] = text
      }
      console.debug(`[useApplySuggestion:${id}] Pinia store patched =>`, field)
    } catch (err) {
      console.error(`[useApplySuggestion:${id}] patch failed`, err)
    }
  }

  function handleEvent(e: Event) {
    const d = (e as CustomEvent).detail || {}
    const field = d.field as string
    const text = (d.text ?? '') as string
    console.info(`[useApplySuggestion:${id}] apply-suggestion received`, { field, text })

    if (!field) {
      console.warn(`[useApplySuggestion:${id}] missing field`)
      return
    }

    const applied = applyToVee(field, text)
    applyToStore(field, text)
    if (!applied) {
      pending.set(field, text)
      console.debug(`[useApplySuggestion:${id}] stored pending suggestion for`, field)
    } else {
      if (pending.has(field)) pending.delete(field)
    }
  }

  function registerSetFieldValue(fn: (name: string, value: any) => void) {
    if (typeof fn !== 'function') {
      console.warn(`[useApplySuggestion:${id}] register called with non-function`)
      return
    }
    setFieldValueRef.value = fn
    console.info(`[useApplySuggestion:${id}] registerSetFieldValue - function registered`)

    // apply pending
    if (pending.size) {
      console.debug(`[useApplySuggestion:${id}] applying ${pending.size} pending suggestions`)
      for (const [fld, txt] of Array.from(pending.entries())) {
        try {
          fn(fld, txt)
          pending.delete(fld)
          console.debug(`[useApplySuggestion:${id}] applied pending ->`, fld)
        } catch (err) {
          console.error(`[useApplySuggestion:${id}] failed applying pending for`, fld, err)
        }
      }
    }
  }

  onMounted(() => {
    window.addEventListener('apply-suggestion', handleEvent as EventListener)
    console.info(`[useApplySuggestion:${id}] listener attached`)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('apply-suggestion', handleEvent as EventListener)
    console.info(`[useApplySuggestion:${id}] listener removed`)
  })

  return { registerSetFieldValue }
}
