import { reactive } from 'vue';
type Toast = { id: number; message: string; type?: 'info' | 'success' | 'error'; ttl?: number; };

const state = reactive<{ list: Toast[] }>({ list: [] });
let id = 1;

export function useToast() {
  function push(message: string, type: Toast['type'] = 'info', ttl = 3000) {
    const t = { id: id++, message, type, ttl };
    state.list.push(t);
    setTimeout(() => {
      const i = state.list.findIndex(x => x.id === t.id);
      if (i >= 0) state.list.splice(i, 1);
    }, ttl);
  }
  return { state, push };
}
