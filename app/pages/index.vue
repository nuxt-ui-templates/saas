<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

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
        container: 'pb-0 sm:pb-0 lg:pb-0',
        title: 'max-w-4xl'
      }"
    >
      <template #headline>
        <UButton
          :to="page.hero.headline.to"
          :target="page.hero.headline.target"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-arrow-right"
          class="rounded-full bg-default ps-1"
        >
          <UBadge
            v-if="page.hero.headline.badge"
            :label="page.hero.headline.badge"
            class="rounded-full font-mono"
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
        container: 'pb-0 sm:pb-0 lg:pb-0',
        header: 'lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-end',
        description: 'lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:mt-0'
      }"
    >
      <UPageGrid class="-mx-4 sm:-mx-6 lg:-mx-8 gap-px bg-border border-t border-default">
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          :title="item.title"
          :description="item.description"
          variant="naked"
          :ui="{
            root: 'bg-default rounded-none',
            container: 'p-6 sm:p-8',
            header: 'mb-6 w-full',
            title: 'text-lg tracking-tight',
            description: 'mt-2'
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
      :ui="{ features: 'gap-6' }"
    >
      <figure class="min-w-0">
        <ProsePre
          :code="page.foundations.code.value"
          :language="page.foundations.code.language"
          :filename="page.foundations.code.filename"
          :ui="{ root: 'my-0' }"
        >
          <code v-text="page.foundations.code.value" />
        </ProsePre>

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
      :ui="{ container: 'pb-0 sm:pb-0 lg:pb-0' }"
    >
      <UPageGrid class="-mx-4 sm:-mx-6 lg:-mx-8 gap-px bg-border border-t border-default">
        <UPageCard
          v-for="(testimonial, index) in page.testimonials.items"
          :key="index"
          variant="naked"
          :description="testimonial.quote"
          :ui="{
            root: 'bg-default rounded-none',
            container: 'p-6 sm:p-8',
            description: 'text-base text-default before:content-[open-quote] after:content-[close-quote]',
            footer: 'pt-8'
          }"
        >
          <template #footer>
            <UUser
              v-bind="testimonial.user"
              size="lg"
            />
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <section class="dark bg-default text-default">
      <UContainer>
        <UPageCTA
          :title="page.cta.title"
          :description="page.cta.description"
          orientation="horizontal"
          variant="naked"
          :ui="{
            root: 'rounded-none',
            container: 'px-0 sm:px-0 lg:px-0 py-20 sm:py-28 lg:py-32 lg:items-end',
            title: 'text-4xl sm:text-5xl lg:text-7xl tracking-tighter font-semibold leading-[0.95]',
            description: 'text-lg'
          }"
        >
          <div class="flex flex-wrap gap-3 lg:justify-end">
            <UButton
              v-for="(link, index) in page.cta.links"
              :key="index"
              v-bind="link"
            />
          </div>
        </UPageCTA>
      </UContainer>
    </section>
  </div>
</template>
