import type { H3Event } from 'h3'

export async function getAuthenticatedUserId(event: H3Event): Promise<string> {
  const session = await getRequestSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  return session.user.id
}
