import { defineNuxtRouteMiddleware, getRouteRules, useRuntimeConfig } from '#imports'

function withRedirectTo(loginPath: string, redirectTarget: string) {
  const [base, qs = ''] = loginPath.split('?')
  const params = new URLSearchParams(qs)
  params.set('redirectTo', redirectTarget)
  return `${base}?${params.toString()}`
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Let explicit meta take precedence.
  if (to.meta.auth !== undefined) {
    return
  }

  const rules = await getRouteRules({ path: to.path })
  const auth = rules.auth

  if (auth === undefined) {
    return
  }

  // Preserve the originally requested URL when redirecting unauthenticated users to login.
  // This is especially important for server-side redirects, where `redirectedFrom` is lost.
  const mode = typeof auth === 'string' ? auth : (auth?.only ?? 'user')
  if (mode === 'user') {
    const redirectTo = typeof auth === 'object' ? auth.redirectTo : undefined
    if (!redirectTo) {
      const loginPath = useRuntimeConfig().public.auth?.redirects?.login ?? '/login'
      const redirectTarget = typeof to.fullPath === 'string' ? to.fullPath : to.path
      to.meta.auth = typeof auth === 'object'
        ? { ...auth, redirectTo: withRedirectTo(loginPath, redirectTarget) }
        : { only: 'user', redirectTo: withRedirectTo(loginPath, redirectTarget) }
      return
    }
  }

  to.meta.auth = auth
})
