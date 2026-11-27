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
  const match = value.match(/^[^\d.,]*(\d+(?:\.\d+)?)[^\d.,]*$/)

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
        container: 'pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-26 lg:pb-14 gap-8 sm:gap-y-8 lg:grid-cols-[1fr_auto] lg:items-end',
        title: 'max-w-[640px]',
        description: 'mt-5 max-w-[640px] text-[17px]/[1.6] sm:text-lg/[1.6]'
      }"
    >
      <UTabs
        v-model="isYearly"
        :items="items"
        :content="false"
        color="neutral"
        :ui="{
          list: 'gap-1 rounded-xl ring ring-default bg-surface',
          indicator: 'rounded-lg shadow-none',
          trigger: 'px-4 py-2 text-[15px]/6 gap-2',
          trailingBadge: 'font-mono text-[11px] px-1.5 py-0.5 rounded-sm'
        }"
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
            :title="plan.title"
            :description="plan.description"
            :badge="plan.badge ? { label: plan.badge, variant: 'solid', size: 'md', class: 'font-mono rounded-md px-2 py-[3px]' } : undefined"
            :features="plan.features.map(feature => ({ title: feature, icon: 'i-lucide-check' }))"
            :button="{ ...plan.button, size: 'xl', block: true }"
            :price="isYearly === '1' ? plan.price.year : plan.price.month"
            :billing-cycle="isYearly === '1' ? '/ year' : '/ month'"
            variant="outline"
            :class="plan.highlight && 'dark in-[.dark]:bg-muted'"
            :ui="{
              root: 'flex flex-col gap-0 rounded-none ring-0 bg-default px-5 py-10 sm:px-10',
              body: 'contents',
              titleWrapper: 'justify-between',
              title: 'text-xl sm:text-xl tracking-[-0.02em]',
              description: 'mt-3 text-[15px]',
              priceWrapper: 'mt-7 items-baseline gap-1.5',
              price: 'text-5xl sm:text-[56px] tracking-[-0.05em]',
              billing: 'flex-row',
              billingPeriod: 'hidden',
              billingCycle: 'text-[15px] font-normal',
              footer: 'mt-7',
              features: 'order-last mt-7 pt-6 border-t border-default gap-3',
              featureIcon: plan.highlight ? 'size-4 text-primary' : 'size-4 text-highlighted',
              featureTitle: 'text-[15px]/[1.4] text-toned'
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
      :ui="{
        container: 'lg:py-26 lg:grid-cols-[300px_1fr] lg:gap-x-20 lg:items-start',
        title: 'lg:text-5xl/[1.04]',
        description: 'mt-4 text-base/[1.6] sm:text-base/[1.6]'
      }"
    >
      <UAccordion
        :items="page.faq.items"
        :unmount-on-hide="false"
        :default-value="'0'"
        class="border-t border-default"
        trailing-icon="i-lucide-plus"
        :ui="{
          trigger: 'min-h-16 py-[18px] gap-4 text-[17px]/7 text-highlighted',
          trailingIcon: 'size-5 text-highlighted group-data-[state=open]:rotate-45',
          body: 'text-base/[1.65] text-muted pt-0 pb-6 pe-12'
        }"
      />
    </UPageSection>
  </div>
</template>
