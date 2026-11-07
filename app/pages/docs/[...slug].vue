<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { withoutTrailingSlash } from 'ufo'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const routePath = computed(() => withoutTrailingSlash(route.path))

const { data: page } = await useAsyncData(routePath.value, () => content.get(routePath.value))
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// v4 has no native prev/next API, so this stays on the v3 compatibility layer, scoped to the
// docs since everything lives in one `content` source now. Its empty slot is typed `null`
// where v3's type hid it, hence the cast in the template below.
const { data: surround } = await useAsyncData(`${routePath.value}-surround`, () => {
  return queryCollectionItemSurroundings('content', routePath.value, {
    fields: ['description']
  }).where('path', 'LIKE', '/docs%')
})

const title = page.value.data.seo?.title || page.value.data.title
const description = page.value.data.seo?.description || page.value.data.description

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

// The client `content` type exposes `meta` as `Record<string, unknown>`, so the table of
// contents the toc plugin attaches needs its shape spelled out.
const tocLinks = computed<TocLink[]>(() => (page.value?.meta.toc as { links?: TocLink[] } | undefined)?.links ?? [])

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Saas', { title, description, headline: 'Docs' })
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.data.title"
      :description="page.data.description"
    />

    <UPageBody>
      <ContentRenderer :value="page" />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround as ContentNavigationItem[]" />
    </UPageBody>

    <template
      v-if="tocLinks.length"
      #right
    >
      <UContentToc :links="tocLinks" />
    </template>
  </UPage>
</template>
