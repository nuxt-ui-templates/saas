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

  const isSubscribed = computed(() => {
    const activeSubscriptions = customerState.data.value?.data?.activeSubscriptions
    if (customerState.error.value || !Array.isArray(activeSubscriptions)) {
      return false
    }

    return activeSubscriptions.length > 0
  })

  const isSubscriptionResolving = computed(() => loggedIn.value && (
    customerState.status.value === 'idle' || customerState.status.value === 'pending'
  ))

  async function onManageSubscription() {
    await portal.execute()

    if (portal.error.value) {
      toast.add({
        color: 'error',
        title: 'Unable to open portal',
        description: portal.error.value.message || 'Please try again.'
      })
    }
  }

  async function onUpgradeToPro() {
    if (isSubscribed.value) {
      await onManageSubscription()
      return
    }

    await checkout.execute({ slug: productSlug })

    if (checkout.error.value) {
      toast.add({
        color: 'error',
        title: 'Unable to start checkout',
        description: checkout.error.value.message || 'Please try again.'
      })
    }
  }

  return {
    isSubscribed,
    isSubscriptionResolving,
    onManageSubscription,
    onUpgradeToPro
  }
}
