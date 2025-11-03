import { watch } from 'vue'
import type { Router } from 'vue-router'
import { i18n } from '@/i18n'

export function setupDynamicTitles(router: Router, opts?: { suffix?: string }) {
  const suffix = opts?.suffix ? ` ${opts.suffix}` : ''

  function updateTitle(to: any) {
    const key = to.meta?.title
    if (!key) return
    const title = i18n.global.t(key) as string
    document.title = `${title}${suffix}`
  }

  router.afterEach((to) => {
    updateTitle(to)
  })

  // update when locale changes (i18n.global.locale is a ref)
  watch(
    () => (i18n.global.locale as any).value,
    () => {
      const current = router.currentRoute.value
      updateTitle(current)
    },
  )
}
