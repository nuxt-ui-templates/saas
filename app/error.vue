<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

const { data: navigation } = await useAsyncData('navigation', () => content.navigation(), {
  transform: data => data.find(item => item.path === '/docs')?.children || []
})
// v4 has no native search-sections API, so this stays on the v3 compatibility layer.
// Everything lives in one `content` source now, so the search is scoped to the docs.
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('content').where('path', 'LIKE', '/docs%'), {
  server: false
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <AppHeader />

    <UMain>
      <UContainer>
        <UPage>
          <UError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        :links="navLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
