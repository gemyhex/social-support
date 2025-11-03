import { ref, readonly } from 'vue'

export type ToastItem = {
  id: string
  message: string
  type?: 'success' | 'error' | 'info'
  timeout?: number
}

const _toasts = ref<ToastItem[]>([])

  ; (window as any).__toasts = _toasts

export function useToast() {
  function push(message: string, type: ToastItem['type'] = 'info', timeout = 3000) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const t: ToastItem = { id, message, type, timeout }
    _toasts.value.push(t)
    if (timeout > 0) {
      setTimeout(() => remove(id), timeout)
    }
    return id
  }

  function remove(id: string) {
    const idx = _toasts.value.findIndex((x) => x.id === id)
    if (idx >= 0) _toasts.value.splice(idx, 1)
  }

  return { push, remove, toasts: readonly(_toasts) }
}

export { _toasts as toastsRef }
