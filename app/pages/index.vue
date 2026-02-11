<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.hero.links"
      :ui="{
        root: 'py-24 sm:py-32 lg:py-40',
        title: 'text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance',
        description: 'text-lg sm:text-xl max-w-2xl text-pretty'
      }"
    >
      <template #top>
        <HeroBackground />
      </template>

      <template #title>
        <MDC
          :value="page.title"
          unwrap="p"
        />
      </template>

      <PromotionalVideo />
    </UPageHero>

    <UPageSection
      v-for="(section, index) in page.sections"
      :key="index"
      :title="section.title"
      :description="section.description"
      :orientation="section.orientation"
      :reverse="section.reverse"
      :features="section.features"
      :ui="{
        title: 'text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight',
        description: 'text-base sm:text-lg text-pretty'
      }"
    >
      <ImagePlaceholder />
    </UPageSection>

    <UPageSection
      :title="page.features.title"
      :description="page.features.description"
      :ui="{
        title: 'text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight',
        description: 'text-base sm:text-lg text-pretty'
      }"
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
          spotlight
          :ui="{
            root: 'border border-[var(--ui-border)] hover:border-[var(--ui-border-accented)] transition-colors duration-200',
            title: 'text-base font-semibold',
            description: 'text-sm text-pretty'
          }"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="testimonials"
      :headline="page.testimonials.headline"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
      :ui="{
        title: 'text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight',
        description: 'text-base sm:text-lg text-pretty'
      }"
    >
      <UPageColumns class="xl:columns-4">
        <UPageCard
          v-for="(testimonial, index) in page.testimonials.items"
          :key="index"
          variant="subtle"
          :description="testimonial.quote"
          :ui="{
            root: 'border border-[var(--ui-border)] hover:border-[var(--ui-border-accented)] transition-colors duration-200',
            description: 'before:content-[open-quote] after:content-[close-quote] text-sm leading-relaxed'
          }"
        >
          <template #footer>
            <UUser
              v-bind="testimonial.user"
              size="lg"
            />
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection>

    <USeparator />

    <UPageCTA
      v-bind="page.cta"
      variant="naked"
      class="overflow-hidden"
      :ui="{
        title: 'text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight',
        description: 'text-base sm:text-lg text-pretty'
      }"
    >
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
