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
        setFieldValueRef.value(field, text)
        return true
      } catch (err) {
        return false
      }
    }
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
        (store.storage.draft as any)[field] = text
      }
    } catch (err) {
      console.error(`patch failed`, err)
    }
  }

  function handleEvent(e: Event) {
    const d = (e as CustomEvent).detail || {}
    const field = d.field as string
    const text = (d.text ?? '') as string

    if (!field) {
      return
    }

    const applied = applyToVee(field, text)
    applyToStore(field, text)
    if (!applied) {
      pending.set(field, text)
    } else {
      if (pending.has(field)) pending.delete(field)
    }
  }

  function registerSetFieldValue(fn: (name: string, value: any) => void) {
    if (typeof fn !== 'function') {
      return
    }
    setFieldValueRef.value = fn

    // apply pending
    if (pending.size) {
      for (const [fld, txt] of Array.from(pending.entries())) {
        try {
          fn(fld, txt)
          pending.delete(fld)
        } catch (err) {
          console.error(`failed applying pending for`, fld, err)
        }
      }
    }
  }

  onMounted(() => {
    window.addEventListener('apply-suggestion', handleEvent as EventListener)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('apply-suggestion', handleEvent as EventListener)
  })

  return { registerSetFieldValue }
}
