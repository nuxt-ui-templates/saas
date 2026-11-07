<script setup lang="ts">
import type { BlogPost } from '~/types'

const { data: page } = await useAsyncData('blog', () => content.get('/blog').then(file => file?.data))
const { data: posts } = await useAsyncData('posts', async () => {
  const files = await content.list<BlogPost>()
  return files.filter(file => file.path.startsWith('/blog/'))
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
      <UBlogPosts>
        <UBlogPost
          v-for="(post, index) in posts"
          :key="index"
          :to="post.path"
          :title="post.data.title"
          :description="post.data.description"
          :image="post.data.image"
          :date="new Date(post.data.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
          :authors="post.data.authors"
          :badge="post.data.badge"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          :class="[index === 0 && 'col-span-full']"
          variant="naked"
          :ui="{
            description: 'line-clamp-2'
          }"
        />
      </UBlogPosts>
    </UPageBody>
  </UContainer>
</template>
