interface PolarBillingConfig {
  checkoutEnabled: boolean
  portalEnabled: boolean
}

interface PolarCustomerState {
  activeSubscriptions?: unknown[]
  grantedBenefits?: unknown[]
  activeMeters?: unknown[]
}

interface PolarClientMethods {
  checkout: (payload: Record<string, unknown>) => Promise<unknown>
  customer: {
    state: () => Promise<{ data?: PolarCustomerState | null }>
    portal: () => Promise<unknown>
  }
}

function toArray(value: unknown) {
  return Array.isArray(value) ? value : []
}

export function usePolarBilling() {
  const runtimeConfig = useRuntimeConfig()
  const { client } = useUserSession()

  const configReady = useState('polar:config-ready', () => false)
  const checkoutAvailable = useState('polar:checkout-enabled', () => false)
  const portalAvailable = useState('polar:portal-enabled', () => false)
  const customerState = useState<PolarCustomerState | null>('polar:customer-state', () => null)

  const checkoutEnabled = computed(() => Boolean(client && configReady.value && checkoutAvailable.value))
  const portalEnabled = computed(() => Boolean(client && configReady.value && portalAvailable.value))

  function getPolarClient() {
    return client as PolarClientMethods | null
  }

  async function ensureBillingConfig() {
    if (configReady.value) {
      return
    }

    try {
      const config = await $fetch<PolarBillingConfig>('/api/billing/polar-config')
      checkoutAvailable.value = Boolean(config.checkoutEnabled)
      portalAvailable.value = Boolean(config.portalEnabled)
    } catch {
      checkoutAvailable.value = false
      portalAvailable.value = false
    } finally {
      configReady.value = true
    }
  }

  async function fetchCustomerState() {
    await ensureBillingConfig()

    const polarClient = getPolarClient()

    if (!portalEnabled.value || !polarClient) {
      customerState.value = null
      return null
    }

    try {
      const response = await polarClient.customer.state()
      customerState.value = response?.data ?? null
      return customerState.value
    } catch {
      customerState.value = null
      return null
    }
  }

  async function startCheckout(options: { slug?: string, products?: string[] | string } = {}) {
    await ensureBillingConfig()

    const polarClient = getPolarClient()

    if (!checkoutEnabled.value || !polarClient) {
      return false
    }

    const payload: Record<string, unknown> = {}

    if (options.products) {
      payload.products = options.products
    } else {
      payload.slug = options.slug || runtimeConfig.public.polarProductSlug || 'pro'
    }

    await polarClient.checkout(payload)

    return true
  }

  async function openPortal() {
    await ensureBillingConfig()

    const polarClient = getPolarClient()

    if (!portalEnabled.value || !polarClient) {
      return false
    }

    await polarClient.customer.portal()

    return true
  }

  const isPro = computed(() => {
    if (!customerState.value) {
      return false
    }

    const subscriptions = toArray(customerState.value.activeSubscriptions)
    const benefits = toArray(customerState.value.grantedBenefits)
    const meters = toArray(customerState.value.activeMeters)

    return subscriptions.length > 0 || benefits.length > 0 || meters.length > 0
  })

  return {
    checkoutEnabled,
    portalEnabled,
    startCheckout,
    openPortal,
    fetchCustomerState,
    isPro,
    ensureBillingConfig
  }
}
