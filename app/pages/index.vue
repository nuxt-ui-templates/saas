<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const { data: snippet } = await useAsyncData('index-snippet', () => queryCollection('snippets').first())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/saas-light.png'
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        root: 'bg-[radial-gradient(var(--ui-border-accented)_1px,transparent_1px)] bg-size-[24px_24px]',
        container: 'pt-16 sm:pt-24 lg:pt-30 pb-0 sm:pb-0 lg:pb-0',
        headline: 'mb-7',
        footer: 'mt-9',
        body: 'mt-14 lg:mt-22',
        title: 'text-wrap max-w-[960px] text-[2.75rem]/[0.96] sm:text-7xl/[0.96] lg:text-8xl/[0.96]',
        description: 'mt-7 max-w-[600px] text-[17px]/[1.55] sm:text-xl/[1.55]'
      }"
    >
      <template #headline>
        <UButton
          :to="page.hero.headline.to"
          :target="page.hero.headline.target"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-arrow-right"
          class="rounded-full ps-1 pe-3 py-1 gap-2.5 font-normal"
          :ui="{ trailingIcon: 'size-3.5' }"
        >
          <UBadge
            v-if="page.hero.headline.badge"
            :label="page.hero.headline.badge"
            class="rounded-full font-mono px-2"
          />
          {{ page.hero.headline.label }}
        </UButton>
      </template>

      <template #links>
        <div class="flex flex-wrap items-center gap-3 min-w-0">
          <UButton
            v-for="(link, index) in page.hero.links"
            :key="index"
            v-bind="link"
          />

          <CopyCommand
            v-if="page.hero.command"
            :command="page.hero.command"
          />
        </div>
      </template>

      <HeroPreview />
    </UPageHero>

    <LogoStrip
      :title="page.logos.title"
      :items="page.logos.items"
    />

    <UPageSection
      id="features"
      :headline="page.features.headline"
      :title="page.features.title"
      :description="page.features.description"
      :ui="{
        container: 'pb-0 sm:pb-0 lg:pb-0 sm:gap-12',
        title: 'max-w-[620px]',
        description: 'max-w-[420px]'
      }"
    >
      <UPageGrid class="-mx-5 sm:-mx-8 lg:-mx-12 gap-px bg-border border-t border-default">
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          :title="item.title"
          :description="item.description"
          variant="naked"
          :ui="{
            root: 'bg-default rounded-none',
            container: 'px-5 py-8 sm:px-9 sm:py-8',
            header: 'mb-7 w-full',
            title: 'text-lg/6 tracking-[-0.02em]',
            description: 'mt-2 text-[15px]/[1.6]'
          }"
        >
          <template #header>
            <FeaturePreview :name="item.preview" />
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection
      :headline="page.foundations.headline"
      :title="page.foundations.title"
      :description="page.foundations.description"
      :features="page.foundations.features"
      orientation="horizontal"
      :ui="{
        container: 'lg:gap-x-18',
        title: 'max-w-md',
        features: 'mt-10 gap-0 divide-y divide-default border-y border-default *:py-5'
      }"
    >
      <figure class="min-w-0">
        <div
          v-if="snippet"
          class="rounded-xl shadow-2xl shadow-neutral-950/30 *:my-0 [&_pre]:p-6 [&_pre]:text-[15px]/[1.75]"
        >
          <ContentRenderer :value="snippet" />
        </div>

        <figcaption
          v-if="page.foundations.caption"
          class="mt-4 text-sm text-muted"
        >
          {{ page.foundations.caption }}
        </figcaption>
      </figure>
    </UPageSection>

    <UPageSection
      id="testimonials"
      :headline="page.testimonials.headline"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
      :ui="{ container: 'pb-0 sm:pb-0 lg:pb-0 sm:gap-12', title: 'max-w-[720px]' }"
    >
      <UPageGrid class="-mx-5 sm:-mx-8 lg:-mx-12 gap-px bg-border border-t border-default">
        <UPageCard
          v-for="(testimonial, index) in page.testimonials.items"
          :key="index"
          variant="naked"
          :description="testimonial.quote"
          :ui="{
            root: 'bg-default rounded-none',
            container: 'px-5 py-8 sm:px-9 sm:py-8',
            description: 'text-[17px]/[1.6] text-default before:content-[open-quote] after:content-[close-quote]',
            footer: 'pt-7'
          }"
        >
          <template #footer>
            <UUser
              v-bind="testimonial.user"
              :avatar="{ ...testimonial.user.avatar, alt: testimonial.user.name, ui: { root: 'bg-accented', fallback: 'text-[13px] font-semibold text-highlighted' } }"
              size="lg"
              :ui="{ root: 'gap-3', description: 'text-[13px] text-dimmed' }"
            />
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <section class="dark bg-default text-default">
      <UContainer class="border-x border-default">
        <UPageCTA
          :title="page.cta.title"
          :description="page.cta.description"
          orientation="horizontal"
          variant="naked"
          :ui="{
            root: 'rounded-none',
            container: 'px-0 sm:px-0 lg:px-0 py-18 sm:py-28 lg:py-32 lg:items-end lg:grid-cols-[minmax(0,640px)_1fr] lg:gap-10',
            title: 'max-w-[640px] text-[2.5rem]/[0.98] sm:text-6xl/[0.98] lg:text-7xl/[0.98] tracking-[-0.045em] font-semibold',
            description: 'max-w-[640px] mt-5 text-lg/[1.6]'
          }"
        >
          <div class="flex flex-wrap gap-3 lg:justify-end">
            <UButton
              v-for="(link, index) in page.cta.links"
              :key="index"
              v-bind="link"
              :class="link.variant === 'outline' && 'bg-transparent'"
            />
          </div>
        </UPageCTA>
      </UContainer>
    </section>
  </div>
</template>
