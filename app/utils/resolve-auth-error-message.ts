type AuthErrorLike = {
  message?: string
  code?: string
  status?: number
}

interface ResolveAuthErrorMessageOptions {
  fallback?: string
  translate?: (ctx: { code?: string, message: string, status?: number }) => string | undefined
}

const DEFAULT_FALLBACK = 'Please try again.'

export function resolveAppAuthErrorMessage(
  error: unknown,
  options: ResolveAuthErrorMessageOptions = {}
): string {
  const normalized = (typeof error === 'object' && error !== null ? error : {}) as AuthErrorLike
  const message = typeof normalized.message === 'string' && normalized.message.length > 0
    ? normalized.message
    : DEFAULT_FALLBACK

  const translated = options.translate?.({
    code: normalized.code,
    message,
    status: normalized.status
  })

  if (translated)
    return translated

  return message === DEFAULT_FALLBACK ? (options.fallback || DEFAULT_FALLBACK) : message
}
