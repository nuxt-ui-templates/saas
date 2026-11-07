<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - Nuxt SaaS template',
  twitterCard: 'summary_large_image'
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
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

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
