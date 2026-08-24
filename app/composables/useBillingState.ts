import type { Ref } from 'vue'

export function useBillingState(loggedIn: Ref<boolean>, productId: string, productSlug: string) {
  const toast = useToast()
  const checkout = useAuthClientAction(client => client.checkout)
  const portal = useAuthClientAction(client => client.customer.portal)
  const customerState = useAuthClientAction(client => client.customer.state)

  watch(loggedIn, (value) => {
    if (value) {
      customerState.execute()
      return
    }

    customerState.data.value = null
    customerState.error.value = null
    customerState.status.value = 'idle'
  }, { immediate: true })

  const isSubscribed = computed(() => customerState.data.value?.data?.activeSubscriptions
    ?.some(subscription => subscription.productId === productId) ?? false)

  const isSubscriptionResolving = computed(() => loggedIn.value && (
    customerState.status.value === 'idle' || customerState.status.value === 'pending'
  ))

  function showError(title: string, error: { message?: string } | null) {
    toast.add({ color: 'error', title, description: error?.message || 'Please try again.' })
  }

  async function onManageSubscription() {
    await portal.execute()

    if (portal.error.value) {
      showError('Unable to open portal', portal.error.value)
    }
  }

  async function onUpgradeToPro() {
    if (customerState.status.value === 'error') {
      await customerState.execute()

      if (customerState.error.value) {
        showError('Unable to load subscription', customerState.error.value)
        return
      }
    }

    if (isSubscribed.value) {
      await onManageSubscription()
      return
    }

    await checkout.execute({ slug: productSlug })

    if (checkout.error.value) {
      showError('Unable to start checkout', checkout.error.value)
    }
  }

  return {
    isSubscribed,
    isSubscriptionResolving,
    onManageSubscription,
    onUpgradeToPro
  }
}
