<script setup lang="ts">
useSeoMeta({ title: 'Dashboard' })

const route = useRoute()
const { productSlug } = useRuntimeConfig().public.polar
const { user, loggedIn, signOut } = useUserSession()
const { isSubscribed, isSubscriptionResolving, onUpgradeToPro, onManageSubscription } = useBillingState({
  loggedIn,
  productSlug
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
                <template v-if="isSubscriptionResolving">
                  <div class="h-10 rounded-md bg-elevated animate-pulse" />
                  <div class="h-10 rounded-md bg-elevated animate-pulse" />
                </template>

                <template v-else>
                  <UButton
                    v-if="isSubscribed"
                    label="Pro plan active"
                    icon="i-lucide-badge-check"
                    color="success"
                    variant="soft"
                    disabled
                    block
                  />
                  <UButton
                    v-else
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
          :description="user ? `Welcome back, ${user.name || user.email}` : undefined"
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
