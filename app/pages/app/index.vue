<script setup lang="ts">
interface PolarAuthClient {
  checkout: (payload: { slug: string }) => Promise<unknown>
  customer: {
    portal: () => Promise<unknown>
  }
}

useSeoMeta({ title: 'Dashboard' })

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const toast = useToast()
const { user, signOut, client } = useUserSession()

const polarProductSlug = computed(() => (runtimeConfig.public.polarProductSlug || '').trim())
const billingEnabled = computed(() => polarProductSlug.value.length > 0)

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
  disabled: !billingEnabled.value
}]])

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Please try again.'
}

function getPolarClient() {
  return client as PolarAuthClient | null
}

async function onUpgradeToPro() {
  if (!billingEnabled.value) {
    return
  }

  const polarClient = getPolarClient()

  if (!polarClient) {
    return
  }

  try {
    await polarClient.checkout({ slug: polarProductSlug.value })
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Unable to start checkout',
      description: getErrorMessage(error)
    })
  }
}

async function onManageSubscription() {
  if (!billingEnabled.value) {
    return
  }

  const polarClient = getPolarClient()

  if (!polarClient) {
    return
  }

  try {
    await polarClient.customer.portal()
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

          <div
            v-if="billingEnabled"
            class="space-y-2"
          >
            <UButton
              label="Upgrade to Pro"
              icon="i-lucide-sparkles"
              color="primary"
              block
              @click="onUpgradeToPro"
            />
            <UButton
              label="Manage subscription"
              icon="i-lucide-receipt-text"
              color="neutral"
              variant="soft"
              block
              @click="onManageSubscription"
            />
          </div>

          <USeparator
            v-if="billingEnabled"
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
