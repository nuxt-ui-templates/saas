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
        container: 'pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-26 lg:pb-14',
        title: 'max-w-[640px]',
        description: 'mt-5 max-w-[640px] text-[17px]/[1.6] sm:text-lg/[1.6]'
      }"
    />

    <section class="border-b border-default">
      <UContainer class="border-x border-default pt-6 pb-18">
        <UChangelogVersions :ui="{ container: 'gap-y-0 sm:gap-y-0 lg:gap-y-0', indicator: 'inset-y-0 start-57 ms-0' }">
          <UChangelogVersion
            v-for="(version, index) in versions"
            :key="index"
            v-bind="version"
            :image="index < 2 ? version.image : undefined"
            :badge="index === 0 ? { label: 'Latest', color: 'primary', variant: 'solid', size: 'md', class: 'font-mono rounded-md px-2 py-[3px]' } : undefined"
            :ui="{
              container: 'max-w-none py-8 lg:py-10 lg:ms-57 lg:ps-8',
              indicator: 'top-11 w-[calc(var(--spacing)*57+5.5px)] items-start justify-between',
              meta: 'mb-3',
              date: 'font-mono text-sm text-muted',
              title: 'text-[22px]/[1.15] sm:text-[26px]/[1.15] lg:text-[30px]/[1.15] tracking-[-0.03em]',
              description: 'mt-3 max-w-[640px] text-base/[1.65]',
              imageWrapper: 'aspect-[2/1] mt-6 rounded-xl ring ring-default',
              dot: index === 0 ? 'size-[11px] my-0 mt-1 bg-primary ring-2 ring-inverted' : 'size-[11px] my-0 mt-1 bg-default ring-2 ring-accented',
              dotInner: 'hidden'
            }"
          />
        </UChangelogVersions>
      </UContainer>
    </section>
  </div>
</template>
