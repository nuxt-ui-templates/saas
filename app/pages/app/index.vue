<script setup lang="ts">
useSeoMeta({ title: 'Dashboard' })

const route = useRoute()
const toast = useToast()
const { user, signOut } = useUserSession()
const {
  checkoutEnabled,
  portalEnabled,
  startCheckout,
  openPortal,
  fetchCustomerState,
  isPro,
  ensureBillingConfig
} = usePolarBilling()

onMounted(async () => {
  await ensureBillingConfig()
  await fetchCustomerState()
})

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
  disabled: !portalEnabled.value
}]])

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Please try again.'
}

async function onUpgradeToPro() {
  try {
    const started = await startCheckout()

    if (!started) {
      toast.add({
        color: 'warning',
        title: 'Billing unavailable',
        description: 'Polar sandbox is not configured on this environment.'
      })
    }
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Unable to start checkout',
      description: getErrorMessage(error)
    })
  }
}

async function onManageSubscription() {
  try {
    const opened = await openPortal()

    if (!opened) {
      toast.add({
        color: 'warning',
        title: 'Portal unavailable',
        description: 'Polar sandbox is not configured on this environment.'
      })
    }
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Unable to open portal',
      description: getErrorMessage(error)
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
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium text-highlighted">
                  {{ user?.name || 'User' }}
                </p>
                <UBadge
                  :label="isPro ? 'Pro' : 'Free'"
                  :color="isPro ? 'primary' : 'neutral'"
                  variant="subtle"
                  size="xs"
                />
              </div>
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

          <div
            v-if="checkoutEnabled || portalEnabled"
            class="space-y-2"
          >
            <UButton
              v-if="checkoutEnabled && !isPro"
              label="Upgrade to Pro"
              icon="i-lucide-sparkles"
              color="primary"
              block
              @click="onUpgradeToPro"
            />
            <UButton
              v-if="portalEnabled"
              label="Manage subscription"
              icon="i-lucide-receipt-text"
              color="neutral"
              variant="soft"
              block
              @click="onManageSubscription"
            />
          </div>

          <USeparator
            v-if="checkoutEnabled || portalEnabled"
            class="my-4"
          />

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
