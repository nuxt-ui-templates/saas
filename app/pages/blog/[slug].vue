<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { withoutTrailingSlash } from 'ufo'
import type { BlogPost } from '~/types'

const route = useRoute()
const routePath = computed(() => withoutTrailingSlash(route.path))

const { data: post } = await useAsyncData(routePath.value, () => content.get<BlogPost>(routePath.value))
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

// v4 has no native prev/next API, so this stays on the v3 compatibility layer, scoped to the
// posts since everything lives in one `content` source now.
const { data: surround } = await useAsyncData(`${routePath.value}-surround`, () => {
  return queryCollectionItemSurroundings('content', routePath.value, {
    fields: ['description']
  }).where('path', 'LIKE', '/blog/%')
})

const title = post.value.data.seo?.title || post.value.data.title
const description = post.value.data.seo?.description || post.value.data.description

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

// The client `content` type exposes `meta` as `Record<string, unknown>`, so the table of
// contents the toc plugin attaches needs its shape spelled out.
const tocLinks = computed<TocLink[]>(() => (post.value?.meta.toc as { links?: TocLink[] } | undefined)?.links ?? [])

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

if (post.value.data.image?.src) {
  useSeoMeta({ ogImage: post.value.data.image.src })
} else {
  defineOgImage('Saas', { title, description, headline: 'Blog' })
}
</script>

<template>
  <UContainer v-if="post">
    <UPageHeader
      :title="post.data.title"
      :description="post.data.description"
    >
      <template #headline>
        <UBadge
          v-bind="post.data.badge"
          variant="subtle"
        />
        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ new Date(post.data.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton
          v-for="(author, index) in post.data.authors"
          :key="index"
          :to="author.to"
          color="neutral"
          variant="subtle"
          target="_blank"
          size="sm"
        >
          <UAvatar
            v-bind="author.avatar"
            alt="Author avatar"
            size="2xs"
          />

          {{ author.name }}
        </UButton>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer
          v-if="post"
          :value="post"
        />

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
  </UContainer>
</template>
