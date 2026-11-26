<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { withoutTrailingSlash } from 'ufo'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const routePath = computed(() => withoutTrailingSlash(route.path))

const { data: page } = await useAsyncData(routePath.value, () => queryCollection('docs').path(routePath.value).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${routePath.value}-surround`, () => {
  return queryCollectionItemSurroundings('docs', routePath.value, {
    fields: ['description']
  })
})

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

const communityLinks = computed(() => [{
  label: 'Star on GitHub',
  to: 'https://github.com/nuxt-ui-templates/saas',
  target: '_blank'
}, {
  label: 'Edit this page',
  to: `https://github.com/nuxt-ui-templates/saas/edit/main/content/${page.value?.stem}.${page.value?.extension}`,
  target: '_blank'
}, {
  label: 'Report an issue',
  to: 'https://github.com/nuxt-ui-templates/saas/issues/new',
  target: '_blank'
}])

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

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
      :title="page.title"
      :description="page.description"
      :headline="headline"
      :ui="{
        headline: 'font-mono text-xs font-normal uppercase tracking-wider text-muted',
        title: 'text-4xl sm:text-5xl tracking-tighter'
      }"
    />

    <UPageBody>
      <ContentRenderer
        v-if="page.body"
        :value="page"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround
        :surround="surround"
        :ui="{
          link: 'px-5 py-4',
          linkLeading: 'hidden',
          linkDescription: 'hidden'
        }"
      />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :links="page.body.toc.links"
        title="On this page"
        highlight
        highlight-color="neutral"
        :ui="{ trigger: 'font-mono text-xs font-normal uppercase tracking-wider text-muted' }"
      >
        <template #bottom>
          <USeparator type="dashed" />

          <UPageLinks
            title="Community"
            :links="communityLinks"
            :ui="{
              title: 'font-mono text-xs font-normal uppercase tracking-wider text-muted',
              linkLabelExternalIcon: 'hidden'
            }"
          />
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
