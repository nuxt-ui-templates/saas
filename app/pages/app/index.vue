<script setup lang="ts">
useSeoMeta({ title: 'Dashboard' })

interface CustomerState {
  activeSubscriptions?: unknown[]
}

interface UseBillingStateOptions {
  productSlug: string
}

async function useSubscriptionState() {
  const {
    data: customerState,
    error: subscriptionError,
    pending: subscriptionPending
  } = await useAuthAsyncData<CustomerState>(
    'dashboard-customer-state',
    requestFetch => requestFetch('/api/auth/customer/state')
  )

  const isSubscribed = computed(() => (customerState.value?.activeSubscriptions?.length || 0) > 0)
  const canShowUpgrade = computed(() => !subscriptionPending.value && !subscriptionError.value && !isSubscribed.value)

  return {
    canShowUpgrade,
    isSubscribed,
    subscriptionPending
  }
}

async function useBillingState({ productSlug }: UseBillingStateOptions) {
  const toast = useToast()
  const checkout = useAuthClientAction(client => client.checkout)
  const portal = useAuthClientAction(client => client.customer.portal)
  const { canShowUpgrade, isSubscribed, subscriptionPending } = await useSubscriptionState()

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

  async function onUpgradeToPro() {
    if (!canShowUpgrade.value) {
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
    canShowUpgrade,
    isSubscribed,
    onUpgradeToPro,
    onManageSubscription,
    subscriptionPending
  }
}

const route = useRoute()
const { productSlug } = useRuntimeConfig().public.polar
const { user, signOut } = useUserSession()
const {
  canShowUpgrade,
  isSubscribed,
  onUpgradeToPro,
  onManageSubscription,
  subscriptionPending
} = await useBillingState({ productSlug })

const dashboardItems = computed(() => [[{
  label: 'Overview',
  icon: 'i-lucide-layout-dashboard',
  to: '/app',
  active: route.path === '/app'
}, {
  label: 'Analytics',
  icon: 'i-lucide-bar-chart-3',
  disabled: true
}, {
  label: 'Members',
  icon: 'i-lucide-users',
  disabled: true
}, {
  label: 'Billing',
  icon: 'i-lucide-credit-card',
  to: '/pricing'
}]])
</script>

<template>
  <UContainer class="py-8">
    <UPage>
      <template #left>
        <UPageAside>
          <template #top>
            <UPageCard variant="subtle">
              <p class="text-sm font-medium text-highlighted">
                {{ user?.name || 'User' }}
              </p>
              <p class="text-xs text-muted mt-1 break-all">
                {{ user?.email }}
              </p>
            </UPageCard>
          </template>

          <UNavigationMenu
            orientation="vertical"
            :items="dashboardItems"
          />

          <USeparator class="my-4" />

          <BetterAuthState>
            <template #default>
              <div class="space-y-2">
                <template v-if="subscriptionPending">
                  <div class="h-10 rounded-md bg-elevated animate-pulse" />
                  <div class="h-10 rounded-md bg-elevated animate-pulse" />
                </template>

                <template v-else>
                  <UButton
                    v-if="canShowUpgrade"
                    label="Upgrade to Pro"
                    icon="i-lucide-sparkles"
                    color="primary"
                    block
                    @click="onUpgradeToPro"
                  />
                  <UButton
                    :label="isSubscribed ? 'Manage subscription' : 'Billing portal'"
                    icon="i-lucide-receipt-text"
                    color="neutral"
                    variant="soft"
                    block
                    @click="onManageSubscription"
                  />
                </template>
              </div>
            </template>

            <template #placeholder>
              <div class="space-y-2">
                <div class="h-10 rounded-md bg-elevated animate-pulse" />
                <div class="h-10 rounded-md bg-elevated animate-pulse" />
              </div>
            </template>
          </BetterAuthState>

          <USeparator class="my-4" />

          <UButton
            label="Sign out"
            color="neutral"
            variant="outline"
            icon="i-lucide-log-out"
            block
            @click="() => signOut()"
          />
        </UPageAside>
      </template>

      <UPageBody>
        <UPageHeader
          title="Dashboard"
          :description="`Welcome back, ${user?.name || user?.email}`"
        />

        <UPageGrid>
          <UPageCard
            title="Users"
            description="1 active account"
            icon="i-lucide-users"
          />
          <UPageCard
            title="Revenue"
            description="$0 this month"
            icon="i-lucide-credit-card"
          />
          <UPageCard
            title="Tasks"
            description="0 pending tasks"
            icon="i-lucide-list-checks"
          />
        </UPageGrid>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
