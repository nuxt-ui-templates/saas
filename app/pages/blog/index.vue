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

const toast = useToast()

const category = ref<string>()
const email = ref('')

// Posts can list several categories in their badge, the first one is the main one
function getCategory(post: { badge?: { label?: string } }) {
  return post.badge?.label?.split(',')[0]?.trim()
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

const categories = computed(() => [...new Set((posts.value || []).map(getCategory).filter(Boolean))] as string[])

const filteredPosts = computed(() => (posts.value || []).filter(post => !category.value || getCategory(post) === category.value))

function onSubmit() {
  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.'
  })

  email.value = ''
}

// Grid lines are drawn by each cell so a partially filled row leaves no gap
const cell = 'rounded-none bg-default p-6 sm:p-8 shadow-[inset_-1px_0_0_0_var(--ui-border),inset_0_-1px_0_0_var(--ui-border)]'
</script>

<template>
  <div v-if="page">
    <UPageHero
      :headline="page.headline"
      :title="page.title"
      :description="page.description"
      :ui="{
        container: 'pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16',
        title: 'max-w-xl text-5xl sm:text-6xl lg:text-7xl',
        description: 'max-w-md'
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
            class="rounded-full px-3.5"
            @click="category = undefined"
          />
          <UButton
            v-for="item in categories"
            :key="item"
            :label="item"
            color="neutral"
            :variant="category === item ? 'solid' : 'outline'"
            :aria-pressed="category === item"
            class="rounded-full px-3.5"
            @click="category = item"
          />
        </div>
      </template>
    </UPageHero>

    <section class="border-b border-default">
      <UContainer class="border-x border-default px-0 sm:px-0 lg:px-0 overflow-hidden">
        <UBlogPosts class="gap-0 sm:gap-0 lg:gap-0 -mb-px -me-px">
          <UBlogPost
            v-for="(post, index) in filteredPosts"
            :key="post.path"
            :to="post.path"
            :title="post.title"
            :description="post.description"
            :image="post.image"
            :date="post.date"
            :authors="post.authors?.map(({ name }) => ({ name }))"
            :badge="index === 0 && !category ? { label: 'Latest', color: 'primary', variant: 'solid', class: 'font-mono' } : undefined"
            :orientation="index === 0 && !category ? 'horizontal' : 'vertical'"
            :class="[index === 0 && !category && 'col-span-full']"
            variant="naked"
            :ui="{
              root: [cell, index === 0 && !category ? 'lg:gap-12 sm:p-8 lg:p-10' : 'gap-0'],
              header: index === 0 && !category ? 'aspect-[16/10] rounded-lg' : 'aspect-[16/10] rounded-lg mb-6',
              date: 'text-sm text-muted',
              title: index === 0 && !category ? 'text-3xl sm:text-4xl tracking-tight' : 'text-lg tracking-tight',
              description: index === 0 && !category ? 'text-base text-muted' : 'text-sm text-muted line-clamp-2',
              authors: 'pt-5'
            }"
          >
            <template #date>
              {{ [getCategory(post), formatDate(post.date)].filter(Boolean).join(' · ') }}
            </template>
          </UBlogPost>

          <div :class="['dark text-default flex flex-col gap-8', cell, 'in-[.dark]:bg-muted']">
            <div>
              <p class="text-2xl font-semibold tracking-tight text-highlighted text-pretty">
                Get new posts in your inbox.
              </p>
              <p class="mt-3 text-sm text-muted">
                One email when something ships. No noise.
              </p>
            </div>

            <form
              class="mt-auto flex flex-col gap-3"
              @submit.prevent="onSubmit"
            >
              <UFormField
                name="email"
                label="Email"
                size="xl"
              >
                <UInput
                  v-model="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  class="w-full"
                />
              </UFormField>

              <UButton
                type="submit"
                label="Subscribe"
                size="xl"
                block
              />
            </form>
          </div>
        </UBlogPosts>
      </UContainer>
    </section>
  </div>
</template>
