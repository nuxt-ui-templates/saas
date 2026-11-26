<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const testimonial = computed(() => page.value?.testimonials.items[1])
</script>

<template>
  <div class="min-h-svh grid lg:grid-cols-2">
    <div class="flex flex-col px-4 sm:px-6 lg:px-12 py-8">
      <NuxtLink
        to="/"
        aria-label="Home"
        class="self-start focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
      >
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>

      <div class="flex-1 flex items-center justify-center py-12">
        <div class="w-full max-w-sm">
          <slot />
        </div>
      </div>
    </div>

    <aside class="dark hidden lg:flex flex-col justify-between gap-12 p-12 bg-default text-default border-s border-default bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] bg-size-[24px_24px]">
      <p class="self-end font-mono text-sm uppercase tracking-wider text-muted">
        Built with Nuxt UI
      </p>

      <figure
        v-if="testimonial"
        class="max-w-xl"
      >
        <blockquote class="text-2xl/snug font-medium tracking-tight text-highlighted">
          “{{ testimonial.quote }}”
        </blockquote>

        <figcaption class="mt-8">
          <UUser
            v-bind="testimonial.user"
            size="lg"
          />
        </figcaption>
      </figure>
    </aside>
  </div>
</template>
