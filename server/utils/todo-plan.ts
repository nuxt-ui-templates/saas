import type { H3Event } from 'h3'
import { Polar } from '@polar-sh/sdk'

export function getFreeTodoLimit(event: H3Event): number {
  const value = Number(useRuntimeConfig(event).freeTodoLimit ?? 3)
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 3
}

export async function resolveTodoMaxItems(event: H3Event, userId: string): Promise<number | null> {
  const freeTodoLimit = getFreeTodoLimit(event)
  const polarAccessToken = useRuntimeConfig(event).polar?.accessToken

  if (!polarAccessToken) {
    return freeTodoLimit
  }

  try {
    const polar = new Polar({
      accessToken: polarAccessToken,
      server: 'sandbox'
    })
    const customerState = await polar.customers.getStateExternal({
      externalId: userId
    })

    if ((customerState.activeSubscriptions?.length ?? 0) > 0) {
      return null
    }
  } catch (error) {
    console.warn('[todos] Failed to resolve customer plan, defaulting to free', error)
  }

  return freeTodoLimit
}
