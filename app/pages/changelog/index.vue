<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('changelog', () => queryCollection('changelog').first())
const { data: versions } = await useAsyncData(route.path, () => queryCollection('versions').order('date', 'DESC').all())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImageComponent('Saas')
</script>

<template>
  <div v-if="page">
    <UContainer>
      <UPageHeader
        v-bind="page"
        class="py-[50px]"
      />

      <UPageBody>
        <UChangelogVersions>
          <UChangelogVersion
            v-for="(version, index) in versions"
            :key="index"
            v-bind="version"
          >
            <template #body>
              <ContentRenderer :value="version.body" />
            </template>
          </UChangelogVersion>
        </UChangelogVersions>
      </UPageBody>
    </UContainer>
  </div>
</template>
