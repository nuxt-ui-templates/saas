<script setup lang="ts">
const { data: page } = await useAsyncData('pricing', () => queryCollection('pricing').first())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Saas', { title, description })

const isYearly = ref('0')

// Only reads plain prices like `$9.90`, anything else hides the badge
function parsePrice(value: string) {
  const match = value.match(/^\D*(\d+(?:\.\d+)?)\D*$/)

  return match ? Number(match[1]) : undefined
}

// Yearly savings of the first plan, shown next to the "Yearly" tab
const discount = computed(() => {
  const plan = page.value?.plans[0]
  const month = plan && parsePrice(plan.price.month)
  const year = plan && parsePrice(plan.price.year)
  if (!month || !year) {
    return undefined
  }

  const percent = Math.round((1 - year / (month * 12)) * 100)

  return percent > 0 ? `-${percent}%` : undefined
})

const items = computed(() => [{
  label: 'Monthly',
  value: '0'
}, {
  label: 'Yearly',
  value: '1',
  badge: discount.value ? { label: discount.value, color: 'primary' as const, variant: 'solid' as const } : undefined
}])
</script>

<template>
  <div v-if="page">
    <UPageHero
      :headline="page.headline"
      :title="page.title"
      :description="page.description"
      orientation="horizontal"
      :ui="{
        container: 'py-16 sm:py-24 lg:py-28 lg:grid-cols-[1fr_auto] lg:items-end',
        title: 'text-5xl sm:text-6xl lg:text-7xl'
      }"
    >
      <UTabs
        v-model="isYearly"
        :items="items"
        :content="false"
        color="neutral"
        :ui="{ list: 'ring ring-default bg-default', trigger: 'px-4' }"
      />
    </UPageHero>

    <section class="border-b border-default">
      <UContainer class="border-x border-default px-0 sm:px-0 lg:px-0">
        <UPricingPlans
          compact
          class="gap-y-0 divide-y lg:divide-y-0 lg:divide-x divide-default"
        >
          <UPricingPlan
            v-for="(plan, index) in page.plans"
            :key="index"
            v-bind="plan"
            :price="isYearly === '1' ? plan.price.year : plan.price.month"
            :billing-cycle="isYearly === '1' ? '/year' : '/month'"
            :variant="plan.highlight ? 'solid' : 'outline'"
            :highlight="false"
            :ui="{
              root: plan.highlight ? 'rounded-none ring-0' : 'rounded-none ring-0 bg-transparent',
              title: 'text-xl sm:text-2xl tracking-tight',
              price: 'text-5xl sm:text-6xl tracking-tighter'
            }"
          />
        </UPricingPlans>
      </UContainer>
    </section>

    <LogoStrip
      :title="page.logos.title"
      :items="page.logos.items"
    />

    <UPageSection
      :title="page.faq.title"
      :description="page.faq.description"
      orientation="horizontal"
      :ui="{ container: 'lg:grid-cols-[2fr_3fr] lg:items-start' }"
    >
      <UAccordion
        :items="page.faq.items"
        :unmount-on-hide="false"
        :default-value="'0'"
        class="border-t border-default"
        :ui="{
          trigger: 'text-base text-highlighted py-5',
          body: 'text-base text-muted pb-5'
        }"
      />
    </UPageSection>
  </div>
</template>
