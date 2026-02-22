<script setup lang="ts">
const { data: page } = await useAsyncData('pricing', () => queryCollection('pricing').first())
const runtimeConfig = useRuntimeConfig()
const toast = useToast()
const { loggedIn, client } = useUserSession()

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImageComponent('Saas')

const isYearly = ref('0')

const items = ref([
  {
    label: 'Monthly',
    value: '0'
  },
  {
    label: 'Yearly',
    value: '1'
  }
])

const polarProductSlug = runtimeConfig.public.polar.productSlug

const plans = computed(() => {
  if (!page.value?.plans) {
    return []
  }

  return page.value.plans.map((plan) => {
    if (!plan.highlight) {
      return plan
    }

    return {
      ...plan,
      button: {
        ...(plan.button || {}),
        label: 'Upgrade to Pro',
        onClick: () => onPaidPlanAction()
      }
    }
  })
})

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Please try again.'
}

async function onPaidPlanAction() {
  if (!loggedIn.value) {
    await navigateTo({
      path: '/login',
      query: { redirect: '/pricing' }
    })
    return
  }

  if (!client) {
    return
  }

  try {
    await client.checkout({ slug: polarProductSlug })
  } catch (error) {
    toast.add({
      color: 'error',
      title: 'Unable to start checkout',
      description: getErrorMessage(error)
    })
  }
}
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
    >
      <template #links>
        <UTabs
          v-model="isYearly"
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
          :price="isYearly === '1' ? plan.price.year : plan.price.month"
          :billing-cycle="isYearly === '1' ? '/year' : '/month'"
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
