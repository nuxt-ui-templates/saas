import type { MaybeRef } from 'vue'

export interface UseBillingStateOptions {
  loggedIn: MaybeRef<boolean>
  productSlug: string
  customerStateKey?: string
  requireLoginForCheckout?: boolean
  loginRedirect?: string
  handlePortalOnSubscribed?: boolean
}

export function useBillingState({
  loggedIn,
  productSlug,
  customerStateKey = 'billing-customer-state',
  requireLoginForCheckout = false,
  loginRedirect = '/pricing',
  handlePortalOnSubscribed = true
}: UseBillingStateOptions) {
  const toast = useToast()
  const checkout = useAuthClientAction(client => client.checkout)
  const portal = useAuthClientAction(client => client.customer.portal)

  const { data: customerState, error, status, refresh } = useCustomerStateAction({
    loggedIn,
    key: customerStateKey,
    immediate: true
  })

  const isSubscribed = computed(() => {
    if (error.value) {
      return false
    }

    if (!customerState.value || typeof customerState.value !== 'object') {
      return false
    }

    const subscriptions = 'activeSubscriptions' in customerState.value
      ? (customerState.value as { activeSubscriptions?: unknown }).activeSubscriptions
      : undefined

    return Array.isArray(subscriptions) && subscriptions.length > 0
  })
  const isSubscriptionResolving = computed(() => toValue(loggedIn) && (status.value === 'idle' || status.value === 'pending'))

  async function onManageSubscription() {
    await portal.execute()

    if (portal.status.value === 'error') {
      toast.add({
        color: 'error',
        title: 'Unable to open portal',
        description: resolveAuthErrorMessage(portal.error.value)
      })
    }
  }

  async function onPaidPlanAction() {
    if (requireLoginForCheckout && !toValue(loggedIn)) {
      await navigateTo({
        path: '/login',
        query: { redirect: loginRedirect }
      })
      return
    }

    if (toValue(loggedIn) && (status.value === 'idle' || status.value === 'pending')) {
      await refresh()
    }

    if (isSubscribed.value && handlePortalOnSubscribed) {
      await onManageSubscription()
      return
    }

    await checkout.execute({ slug: productSlug })

    if (checkout.status.value === 'error') {
      toast.add({
        color: 'error',
        title: 'Unable to start checkout',
        description: resolveAuthErrorMessage(checkout.error.value)
      })
    }
  }

  return {
    customerState,
    error,
    isSubscribed,
    isSubscriptionResolving,
    status,
    onPaidPlanAction,
    onManageSubscription,
    onUpgradeToPro: onPaidPlanAction
  }
}
