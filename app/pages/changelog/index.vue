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
        container: 'py-16 sm:py-24 lg:py-28',
        title: 'text-5xl sm:text-6xl lg:text-7xl'
      }"
    />

    <section class="border-b border-default">
      <UContainer class="border-x border-default py-16 sm:py-24">
        <UChangelogVersions>
          <UChangelogVersion
            v-for="(version, index) in versions"
            :key="index"
            v-bind="version"
            :badge="index === 0 ? { label: 'Latest', color: 'primary', variant: 'solid' } : undefined"
            :ui="{
              date: 'font-mono',
              title: 'text-2xl tracking-tight'
            }"
          >
            <template #body>
              <ContentRenderer :value="version.body" />
            </template>
          </UChangelogVersion>
        </UChangelogVersions>
      </UContainer>
    </section>
  </div>
</template>
