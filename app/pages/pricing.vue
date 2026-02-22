<script setup lang="ts">
import type { PricingPlanProps } from '#ui/types'

interface CustomerState {
  activeSubscriptions?: unknown[]
}

interface UsePricingBillingStateOptions {
  loggedIn: { value: boolean }
  productSlug: string
}

async function useSubscriptionState() {
  const {
    data: customerState,
    error: subscriptionError,
    pending: subscriptionPending
  } = await useAuthAsyncData<CustomerState>(
    'pricing-customer-state',
    requestFetch => requestFetch('/api/auth/customer/state')
  )

  const isSubscribed = computed(() => (customerState.value?.activeSubscriptions?.length || 0) > 0)
  const canUpgrade = computed(() => !subscriptionPending.value && !subscriptionError.value && !isSubscribed.value)

  return {
    canUpgrade,
    isSubscribed,
    subscriptionError,
    subscriptionPending
  }
}

async function usePricingBillingState({ loggedIn, productSlug }: UsePricingBillingStateOptions) {
  const toast = useToast()
  const checkout = useAuthClientAction(client => client.checkout)
  const portal = useAuthClientAction(client => client.customer.portal)
  const {
    canUpgrade,
    isSubscribed,
    subscriptionError,
    subscriptionPending
  } = await useSubscriptionState()

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
    if (!loggedIn.value) {
      await navigateTo({
        path: '/login',
        query: { redirect: '/pricing' }
      })
      return
    }

    if (!canUpgrade.value) {
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
    isSubscribed,
    onPaidPlanAction,
    subscriptionError,
    subscriptionPending
  }
}

const { data: page } = await useAsyncData('pricing', () => queryCollection('pricing').first())
const { productSlug } = useRuntimeConfig().public.polar
const { loggedIn } = useUserSession()
const {
  isSubscribed,
  onPaidPlanAction,
  subscriptionError,
  subscriptionPending
} = await usePricingBillingState({ loggedIn, productSlug })

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImageComponent('Saas')

const billingCycle = ref('0')

const items = [
  {
    label: 'Monthly',
    value: '0'
  },
  {
    label: 'Yearly',
    value: '1',
    disabled: true
  }
]

const plans = computed<PricingPlanProps[]>(() => {
  if (!page.value?.plans?.length) {
    return []
  }

  const proPlan = page.value.plans.find(plan => plan.highlight) || page.value.plans[0]!

  const freePlan: PricingPlanProps = {
    title: 'Free',
    description: 'For personal projects and evaluation.',
    price: '$0',
    button: {
      label: 'Current plan',
      color: 'neutral',
      variant: 'subtle',
      disabled: true
    },
    features: [
      'Basic dashboard access',
      'Community support',
      'No billing required'
    ]
  }

  const normalizedProPlan: PricingPlanProps = {
    title: 'Pro',
    description: proPlan.description || 'For teams that need paid billing features.',
    price: proPlan.price?.month || '$19.9',
    button: {
      ...(proPlan.button || {}),
      label: subscriptionPending.value
        ? 'Checking subscription...'
        : (isSubscribed.value || subscriptionError.value ? 'Manage subscription' : 'Upgrade to Pro'),
      disabled: subscriptionPending.value,
      onClick: () => onPaidPlanAction()
    },
    features: proPlan.features || [],
    highlight: Boolean(proPlan.highlight)
  }

  return [freePlan, normalizedProPlan]
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
    >
      <template #links>
        <UTabs
          v-model="billingCycle"
          :items="items"
          color="neutral"
          size="xs"
          class="w-48"
          :ui="{
            list: 'ring ring-accented rounded-full',
            indicator: 'rounded-full',
            trigger: 'w-1/2'
          }"
        />
      </template>
    </UPageHero>

    <UContainer>
      <UPricingPlans scale>
        <UPricingPlan
          v-for="(plan, index) in plans"
          :key="index"
          v-bind="plan"
          :price="plan.price"
          billing-cycle="/month"
        />
      </UPricingPlans>
    </UContainer>

    <UPageSection>
      <UPageLogos>
        <UIcon
          v-for="icon in page.logos.icons"
          :key="icon"
          :name="icon"
          class="w-12 h-12 flex-shrink-0 text-muted"
        />
      </UPageLogos>
    </UPageSection>

    <UPageSection
      :title="page.faq.title"
      :description="page.faq.description"
    >
      <UAccordion
        :items="page.faq.items"
        :unmount-on-hide="false"
        :default-value="['0']"
        type="multiple"
        class="max-w-3xl mx-auto"
        :ui="{
          trigger: 'text-base text-highlighted',
          body: 'text-base text-muted'
        }"
      />
    </UPageSection>
  </div>
</template>
