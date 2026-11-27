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
const cell = 'rounded-none bg-default px-5 pt-8 pb-10 sm:px-9 sm:pt-8 sm:pb-10 shadow-[inset_-1px_0_0_0_var(--ui-border),inset_0_-1px_0_0_var(--ui-border)]'
</script>

<template>
  <div v-if="page">
    <UPageHero
      :headline="page.headline"
      :title="page.title"
      :description="page.description"
      :ui="{
        container: 'pt-16 pb-10 sm:pt-20 sm:pb-10 lg:pt-26 lg:pb-10',
        title: 'max-w-[640px]',
        description: 'max-w-[420px] text-[17px]/[1.6] sm:text-[17px]/[1.6]',
        footer: 'mt-10 lg:mt-12'
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
            :class="['rounded-full px-3.5 py-2 font-normal', category && 'ring-default text-toned']"
            @click="category = undefined"
          />
          <UButton
            v-for="item in categories"
            :key="item"
            :label="item"
            color="neutral"
            :variant="category === item ? 'solid' : 'outline'"
            :aria-pressed="category === item"
            :class="['rounded-full px-3.5 py-2 font-normal', category !== item && 'ring-default text-toned']"
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
            :authors="post.authors?.map(({ name }) => index === 0 && !category ? { name, avatar: { alt: name }, size: 'lg' as const } : { name })"
            :badge="index === 0 && !category ? { label: 'Latest', color: 'primary', variant: 'solid', class: 'font-mono' } : undefined"
            :orientation="index === 0 && !category ? 'horizontal' : 'vertical'"
            :class="[index === 0 && !category && 'col-span-full']"
            variant="naked"
            :ui="index === 0 && !category ? {
              root: [cell, 'sm:p-12 lg:grid-cols-[5fr_4fr] lg:gap-x-14'],
              header: 'aspect-[16/10] rounded-[14px] ring ring-default shadow-none',
              body: 'p-0 sm:p-0 lg:px-0 pt-8 lg:pt-0',
              meta: 'mb-5 gap-3',
              date: 'text-sm text-muted',
              title: 'text-[1.875rem]/[1.05] sm:text-[2.75rem]/[1.05] tracking-[-0.035em]',
              description: 'mt-4 text-[17px]/[1.6] text-muted',
              authors: 'pt-7'
            } : {
              root: [cell, 'gap-0'],
              header: 'aspect-[16/10] rounded-xl ring ring-default shadow-none',
              body: 'p-0 sm:p-0 pt-5 sm:pt-5',
              meta: 'mb-3',
              date: 'text-[13px] text-muted',
              title: 'text-[22px]/[1.2] tracking-[-0.025em]',
              description: 'mt-3 text-[15px]/[1.6] text-muted line-clamp-2',
              authors: 'pt-5'
            }"
          >
            <template #date>
              <span class="inline-flex flex-wrap gap-x-2.5">
                <template v-if="getCategory(post)">
                  <span>{{ getCategory(post) }}</span>
                  <span aria-hidden="true">·</span>
                </template>
                <time :datetime="post.date">{{ formatDate(post.date) }}</time>
              </span>
            </template>
          </UBlogPost>

          <div :class="['dark text-default flex flex-col justify-between gap-8', cell, 'in-[.dark]:bg-muted']">
            <div>
              <p class="text-[26px]/[1.15] font-semibold tracking-[-0.03em] text-highlighted text-pretty">
                Get new posts in your inbox.
              </p>
              <p class="mt-3 text-[15px]/[1.6] text-muted">
                One email when something ships. No noise.
              </p>
            </div>

            <form
              class="flex flex-col gap-2.5"
              @submit.prevent="onSubmit"
            >
              <UFormField
                name="email"
                label="Email"
                :ui="{ container: 'mt-2.5' }"
              >
                <UInput
                  v-model="email"
                  type="email"
                  size="xl"
                  placeholder="you@company.com"
                  required
                  class="w-full"
                  :ui="{ base: 'py-[11px]' }"
                />
              </UFormField>

              <UButton
                type="submit"
                label="Subscribe"
                size="xl"
                block
                class="py-2.5 text-[15px]/6"
              />
            </form>
          </div>
        </UBlogPosts>
      </UContainer>
    </section>
  </div>
</template>
