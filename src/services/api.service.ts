import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10000
})

export default {
  get(path: string, params?: any) {
    return api.get(path, { params }).then((r) => r.data)
  },
  post(path: string, data?: any) {
    return api.post(path, data).then((r) => r.data)
  },
  put(path: string, data?: any) {
    return api.put(path, data).then((r) => r.data)
  },
  delete(path: string) {
    return api.delete(path).then((r) => r.data)
  },
  raw: api
}
