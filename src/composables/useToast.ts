import { reactive } from 'vue'

export type ToastItem = { id: string; message: string; type?: 'success' | 'error' | 'info'; timeout?: number }

const toasts = reactive<Array<ToastItem>>([])

export function useToast() {
  function push(message: string, type: ToastItem['type'] = 'info', timeout = 3000) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const t = { id, message, type, timeout }
    toasts.push(t)
    if (timeout > 0) {
      setTimeout(() => remove(id), timeout)
    }
    return id
  }
  function remove(id: string) {
    const idx = toasts.findIndex((x) => x.id === id)
    if (idx >= 0) toasts.splice(idx, 1)
  }
  return { push, remove, toasts }
}

export { toasts }
