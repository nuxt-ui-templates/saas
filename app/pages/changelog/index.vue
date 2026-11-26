<script setup lang="ts">
const { data: page } = await useAsyncData('changelog', () => queryCollection('changelog').first())
const { data: versions } = await useAsyncData('versions', () => queryCollection('versions').order('date', 'DESC').all())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Saas', { title, description })
</script>

<template>
  <div v-if="page">
    <UPageHero
      :headline="page.headline"
      :title="page.title"
      :description="page.description"
      :ui="{
        container: 'pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16',
        title: 'max-w-xl text-5xl sm:text-6xl lg:text-7xl',
        description: 'max-w-md'
      }"
    />

    <section class="border-b border-default">
      <UContainer class="border-x border-default py-16 sm:py-24">
        <UChangelogVersions :ui="{ indicator: 'start-40' }">
          <UChangelogVersion
            v-for="(version, index) in versions"
            :key="index"
            v-bind="version"
            :badge="index === 0 ? { label: 'Latest', color: 'primary', variant: 'solid', class: 'font-mono' } : undefined"
            :ui="{
              container: 'max-w-none lg:ms-48',
              indicator: 'w-40',
              date: 'font-mono',
              title: 'text-2xl sm:text-[1.625rem] tracking-tight',
              description: 'text-base max-w-2xl mt-2',
              imageWrapper: 'aspect-[2/1] mt-6',
              dotInner: index === 0 ? 'bg-primary' : 'hidden'
            }"
          />
        </UChangelogVersions>
      </UContainer>
    </section>
  </div>
</template>
