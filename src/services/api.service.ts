import axios, { AxiosInstance, AxiosError } from 'axios'
import { useToast } from '@/composables/useToast'
import type { Error as SimpleError } from '@/types/error'

const DEFAULT_TIMEOUT_MS = 15000
const API_KEY = (import.meta.env.VITE_OPENAI_KEY as string) || '';

const toast = useToast()
const controller = new AbortController();

const instance: AxiosInstance = axios.create({
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    signal: controller.signal as any
  },
})

/** Normalize error message */
function normalize(err: AxiosError | any): SimpleError {
  if (err?.isAxiosError && !err.response) {
    const message = err.message || 'Network error'
    return { message, status: undefined }
  }

  // If server returned a response, prefer response message or status text
  const status = err?.response?.status
  const data = err?.response?.data
  // server might return { message: '...' } or plain text
  const serverMessage =
    (data && (data.message || data.error)) ||
    (typeof data === 'string' ? data : undefined) ||
    err?.message ||
    'Request failed'

  return { message: serverMessage, status }
}

/** error handler: show toast and return normalized error */
function handleError(raw: unknown): SimpleError {
  const e = normalize(raw as any)
  const message = typeof e.message === 'object' ? e.message?.message : e.message
  try {
    toast.push(message || 'Something went wrong', 'error', 4000)
  } catch {
    // ignore toast errors
  }
  return e
}

async function get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  try {
    const res = await instance.get(url, { params })
    return res.data as T
  } catch (raw) {
    throw handleError(raw)
  }
}

async function post<T = any>(url: string, payload?: any, params?: Record<string, any>): Promise<T> {
  try {
    const res = await instance.post(url, payload ?? {}, { params })
    return res.data as T
  } catch (raw) {
    throw handleError(raw)
  }
}

export { instance, get, post, normalize as normalizeApiError }
export type { SimpleError as ApiError }
