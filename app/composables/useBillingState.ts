import type { Ref } from 'vue'

interface UseBillingStateOptions {
  loggedIn: Ref<boolean>
  productSlug: string
}

export function useBillingState({ loggedIn, productSlug }: UseBillingStateOptions) {
  const toast = useToast()
  const checkout = useAuthClientAction(client => client.checkout)
  const portal = useAuthClientAction(client => client.customer.portal)
  const customerState = useAuthClientAction(client => client.customer.state)

  watchEffect(() => {
    if (!loggedIn.value || customerState.status.value !== 'idle') {
      return
    }

    customerState.execute()
  })

  const polarCustomerState = computed(() => customerState.data.value?.data)

  const isSubscribed = computed(() => {
    if (customerState.error.value) {
      return false
    }

    return (polarCustomerState.value?.activeSubscriptions?.length ?? 0) > 0
  })

  const isSubscriptionResolving = computed(() => loggedIn.value && (
    customerState.status.value === 'idle' || customerState.status.value === 'pending'
  ))

  function showBillingError(title: string, error: unknown) {
    toast.add({
      color: 'error',
      title,
      description: resolveAuthErrorMessage(error)
    })
  }

  async function onManageSubscription() {
    await portal.execute()

    if (portal.status.value === 'error') {
      showBillingError('Unable to open portal', portal.error.value)
    }
  }

  async function onUpgradeToPro() {
    if (isSubscribed.value) {
      await onManageSubscription()
      return
    }

    await checkout.execute({ slug: productSlug })

    if (checkout.status.value === 'error') {
      showBillingError('Unable to start checkout', checkout.error.value)
    }
  }

  return {
    isSubscribed,
    isSubscriptionResolving,
    onManageSubscription,
    onUpgradeToPro
  }
}
