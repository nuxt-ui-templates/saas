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
  <UPage
    v-if="page"
    :ui="{ root: 'lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-0', center: 'lg:col-span-1 lg:px-14 lg:pt-12 lg:pb-20', right: 'lg:col-span-1 lg:border-s lg:border-default' }"
  >
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
      :ui="{
        root: 'pt-8 pb-9 lg:pt-0 border-default',
        headline: 'mb-3 font-mono text-[13px] font-normal uppercase tracking-[0.04em] text-muted',
        title: 'text-[34px]/[1.04] sm:text-5xl/[1.04] tracking-[-0.04em]',
        description: 'mt-4 text-lg/[1.6] sm:text-[19px]/[1.6]'
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
          link: 'px-5 py-[18px] rounded-xl bg-surface ring-default',
          linkTitle: 'text-base font-medium',
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
        color="neutral"
        highlight-color="neutral"
        :ui="{
          root: 'lg:px-6 lg:mx-0',
          container: 'lg:pt-12',
          trigger: 'font-mono text-xs font-normal uppercase tracking-[0.04em] text-dimmed',
          link: 'text-sm py-1.5',
          bottom: 'mt-7 gap-7'
        }"
      >
        <template #bottom>
          <USeparator />

          <UPageLinks
            title="Community"
            :links="communityLinks"
            :ui="{
              title: 'font-mono text-xs font-normal uppercase tracking-[0.04em] text-dimmed',
              link: 'text-sm',
              linkLabelExternalIcon: 'hidden'
            }"
          />
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
