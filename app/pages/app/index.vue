<script setup lang="ts">
useSeoMeta({ title: 'Dashboard' })

type DashboardCustomerState = {
  activeSubscriptions?: unknown[]
}

function useSubscriptionState(loggedIn: { value: boolean }) {
  const requestFetch = useRequestFetch()
  const { data: customerState } = useAsyncData<DashboardCustomerState | null>('dashboard-customer-state', async () => {
    if (!loggedIn.value) {
      return null
    }

    try {
      return await requestFetch<DashboardCustomerState>('/api/auth/customer/state')
    } catch {
      return null
    }
  }, {
    default: () => null
  })

  const isSubscribed = computed(() => (customerState.value?.activeSubscriptions?.length || 0) > 0)

  return {
    isSubscribed
  }
}

const route = useRoute()
const { productSlug } = useRuntimeConfig().public.polar
const toast = useToast()
const { user, loggedIn, signOut } = useUserSession()
const checkout = useAuthClientAction(client => client.checkout)
const portal = useAuthClientAction(client => client.customer.portal)
const { isSubscribed } = useSubscriptionState(loggedIn)

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

async function onUpgradeToPro() {
  if (isSubscribed.value) {
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
                <UButton
                  v-if="!isSubscribed"
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
