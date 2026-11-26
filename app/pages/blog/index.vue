<script setup lang="ts">
const { data: page } = await useAsyncData('blog', () => queryCollection('blog').first())
const { data: posts } = await useAsyncData('posts', () => queryCollection('posts').order('date', 'DESC').all())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Saas', { title, description })

const category = ref<string>()

const categories = computed(() => [...new Set((posts.value || []).map(post => post.badge?.label).filter(Boolean))] as string[])

const filteredPosts = computed(() => (posts.value || []).filter(post => !category.value || post.badge?.label === category.value))
</script>

<template>
  <div v-if="page">
    <UPageHero
      :headline="page.headline"
      :title="page.title"
      :description="page.description"
      :ui="{
        container: 'py-16 sm:py-24 lg:py-28',
        title: 'text-5xl sm:text-6xl lg:text-7xl'
      }"
    >
      <template #links>
        <div
          role="group"
          aria-label="Filter by category"
          class="flex flex-wrap gap-2"
        >
          <UButton
            label="All posts"
            color="neutral"
            :variant="!category ? 'solid' : 'outline'"
            :aria-pressed="!category"
            class="rounded-full"
            @click="category = undefined"
          />
          <UButton
            v-for="item in categories"
            :key="item"
            :label="item"
            color="neutral"
            :variant="category === item ? 'solid' : 'outline'"
            :aria-pressed="category === item"
            class="rounded-full"
            @click="category = item"
          />
        </div>
      </template>
    </UPageHero>

    <section class="border-b border-default">
      <UContainer class="border-x border-default py-12 sm:py-16">
        <UBlogPosts>
          <UBlogPost
            v-for="(post, index) in filteredPosts"
            :key="post.path"
            :to="post.path"
            :title="post.title"
            :description="post.description"
            :image="post.image"
            :date="new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
            :authors="post.authors"
            :badge="post.badge"
            :orientation="index === 0 ? 'horizontal' : 'vertical'"
            :class="[index === 0 && 'col-span-full']"
            variant="naked"
            :ui="{
              title: index === 0 ? 'text-3xl sm:text-4xl tracking-tight' : 'tracking-tight',
              description: 'line-clamp-2'
            }"
          />
        </UBlogPosts>
      </UContainer>
    </section>
  </div>
</template>
