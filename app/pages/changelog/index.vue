<script setup lang="ts">
const { data: page } = await useAsyncData('changelog', () => content.get('/changelog').then(file => file?.data))
// `list()` returns entries without their body, so each version is loaded with `get()` to render it.
const { data: versions } = await useAsyncData('versions', async () => {
  const files = await content.list()
  const entries = files
    .filter(file => file.path.startsWith('/changelog/'))
    .sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)))
  return Promise.all(entries.map(entry => content.get(entry.path)))
})

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
          v-bind="version?.data"
        >
          <template #body>
            <ContentRenderer
              v-if="version"
              :value="version"
            />
          </template>
        </UChangelogVersion>
      </UChangelogVersions>
    </UPageBody>
  </UContainer>
</template>
