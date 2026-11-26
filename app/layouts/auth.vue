<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const testimonial = computed(() => page.value?.testimonials.items[1])
</script>

<template>
  <div class="min-h-svh grid lg:grid-cols-2">
    <div class="flex flex-col px-4 sm:px-6 lg:px-12 xl:px-16 py-8">
      <NuxtLink
        to="/"
        aria-label="Home"
        class="self-start focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
      >
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>

      <div class="flex-1 flex items-center justify-center py-14">
        <div class="w-full max-w-sm">
          <slot />
        </div>
      </div>
    </div>

    <aside class="dark hidden lg:flex flex-col justify-between gap-12 p-12 xl:p-16 bg-default text-default border-s border-default bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] bg-size-[24px_24px]">
      <p class="self-end font-mono text-sm uppercase tracking-wider text-muted">
        Built with Nuxt UI
      </p>

      <div
        aria-hidden="true"
        class="max-w-lg p-7 rounded-xl border border-default bg-default"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm text-muted">
            Monthly recurring revenue
          </p>
          <span class="font-mono text-xs text-dimmed">Demo data</span>
        </div>

        <p class="mt-2 text-4xl font-semibold tracking-tighter text-highlighted">
          $48,210
        </p>

        <svg
          viewBox="0 0 400 80"
          preserveAspectRatio="none"
          class="block mt-5 w-full h-20 text-primary"
        >
          <polyline
            points="0,70 40,64 80,66 120,52 160,56 200,40 240,44 280,28 320,32 360,16 400,8"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linejoin="round"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>

      <figure
        v-if="testimonial"
        class="max-w-xl"
      >
        <blockquote class="text-2xl/snug xl:text-[1.75rem]/snug font-medium tracking-tight text-highlighted">
          “{{ testimonial.quote }}”
        </blockquote>

        <figcaption class="mt-6">
          <UUser
            v-bind="testimonial.user"
            size="lg"
          />
        </figcaption>
      </figure>
    </aside>
  </div>
</template>
