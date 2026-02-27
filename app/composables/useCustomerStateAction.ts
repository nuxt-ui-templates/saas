import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js'
import type { MaybeRef } from 'vue'

type CustomerStateStatus = 'idle' | 'pending' | 'success' | 'error'

export interface UseCustomerStateActionOptions {
  loggedIn: MaybeRef<boolean>
  key?: string
  immediate?: boolean
}

function resolveCustomerState(value: unknown): CustomerState | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  if ('data' in value) {
    const data = (value as { data?: unknown }).data
    if (!data || typeof data !== 'object') {
      return null
    }
    return data as CustomerState
  }

  return value as CustomerState
}

export function useCustomerStateAction({
  loggedIn,
  key = 'customer-state',
  immediate = true
}: UseCustomerStateActionOptions) {
  const stateAction = useAuthClientAction(client => client.customer.state)

  const data = useState<CustomerState | null>(`customer-state:${key}:data`, () => null)
  const status = useState<CustomerStateStatus>(`customer-state:${key}:status`, () => 'idle')
  const error = useState<unknown | null>(`customer-state:${key}:error`, () => null)
  const hasLoaded = useState<boolean>(`customer-state:${key}:loaded`, () => false)

  function reset() {
    data.value = null
    status.value = 'idle'
    error.value = null
    hasLoaded.value = false
  }

  async function refresh() {
    if (!import.meta.client) {
      return
    }

    if (!toValue(loggedIn)) {
      reset()
      return
    }

    status.value = 'pending'
    error.value = null

    await stateAction.execute()

    status.value = stateAction.status.value
    error.value = stateAction.error.value

    if (stateAction.status.value === 'success') {
      data.value = resolveCustomerState(stateAction.data.value)
      hasLoaded.value = true
    }
  }

  watch(() => toValue(loggedIn), async (isLoggedIn) => {
    if (!import.meta.client) {
      return
    }

    if (!isLoggedIn) {
      reset()
      return
    }

    if (!immediate) {
      return
    }

    if (status.value === 'idle' || !hasLoaded.value) {
      await refresh()
    }
  }, { immediate: true })

  return {
    data,
    error,
    status,
    refresh
  }
}
