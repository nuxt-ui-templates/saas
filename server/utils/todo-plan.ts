import type { H3Event } from 'h3'
import type { TodoPlanLimits } from '~~/shared/types/todos'

export function getFreeTodoLimit(event: H3Event): number {
  const value = Number(useRuntimeConfig(event).todo?.freeLimit ?? 3)
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 3
}

export async function resolveTodoPlan(event: H3Event): Promise<TodoPlanLimits> {
  const freePlan: TodoPlanLimits = {
    plan: 'free',
    maxItems: getFreeTodoLimit(event)
  }

  try {
    const customerState = await fetchWithEvent<{ activeSubscriptions?: unknown[] }>(event, '/api/auth/customer/state')
    if (Array.isArray(customerState.activeSubscriptions) && customerState.activeSubscriptions.length > 0) {
      return {
        plan: 'pro',
        maxItems: null
      }
    }
  } catch (error) {
    console.warn('[todos] Failed to resolve customer plan, defaulting to free', error)
  }

  return freePlan
}
