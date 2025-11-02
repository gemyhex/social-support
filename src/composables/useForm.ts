import { useForm } from 'vee-validate'
import { nextTick } from 'vue'

export type UseDynamicFormReturn<TValues = Record<string, any>> = {
  validateStep: () => Promise<boolean>
  values: TValues
  errors: Record<string, any>
  setFieldValue: (name: string, value: any) => void
  setFieldTouched: (name: string, touched?: boolean) => void
  focusFirstInvalid: (errs?: Record<string, any>) => Promise<void>
  setValues?: (v: Partial<TValues>) => void
}

export function useDynamicForm<TValues = Record<string, any>>(opts: {
  validationSchema?: any
  initialValues?: TValues
}) {
  const { validate, values, errors, setFieldValue, setFieldTouched, setValues } = useForm<TValues>({
    validationSchema: opts.validationSchema,
    initialValues: opts.initialValues,
  })

  async function focusFirstInvalid(errs?: Record<string, any>) {
    const first = errs ? Object.keys(errs)[0] : Object.keys((errors as any) || {})[0]
    if (!first) return
    await nextTick()
    const name = typeof (window as any).CSS?.escape === 'function' ? (window as any).CSS.escape(first) : first
    const el =
      document.querySelector(`[data-name="${name}"]`) ||
      document.querySelector(`[name="${name}"]`) ||
      document.getElementById(first)
    if (el && (el as HTMLElement).focus) {
      try {
        (el as HTMLElement).focus()
          (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
      } catch { }
    }
  }

  async function validateStep(): Promise<boolean> {
    const result = await validate()
    const ok = !!(result && typeof result === 'object' && 'valid' in result ? result.valid : result)
    if (!ok) await focusFirstInvalid(result.errors)
    return ok
  }

  return {
    validateStep,
    values,
    errors,
    setFieldValue,
    setFieldTouched,
    focusFirstInvalid,
    setValues,
  } as UseDynamicFormReturn<TValues>
}
