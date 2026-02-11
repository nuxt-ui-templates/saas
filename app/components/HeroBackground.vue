<script setup lang="ts">
const appear = ref(false)

onMounted(() => {
  setTimeout(() => {
    appear.value = true
  }, 100)
})
</script>

<template>
  <div
    class="absolute inset-x-0 -top-px w-full transition-opacity duration-1000 pointer-events-none"
    :class="appear ? 'opacity-100' : 'opacity-0'"
  >
    <!-- Subtle grid pattern -->
    <svg
      class="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hero-grid"
          x="0"
          y="0"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 64 0 L 0 0 0 64"
            fill="none"
            stroke="currentColor"
            stroke-width="0.5"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#hero-grid)"
      />
    </svg>

    <!-- Top radial glow -->
    <div class="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-neutral-100/50 via-transparent to-transparent dark:from-neutral-900/30 dark:via-transparent dark:to-transparent" />

    <!-- Center spotlight glow -->
    <div class="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] rounded-full bg-neutral-200/30 dark:bg-white/[0.02] blur-[120px]" />

    <!-- Top accent line -->
    <svg
      viewBox="0 0 1440 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full"
    >
      <defs>
        <linearGradient
          id="line-gradient"
          x1="0"
          y1="1"
          x2="1440"
          y2="1"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            stop-color="currentColor"
            stop-opacity="0"
          />
          <stop
            offset="0.3"
            stop-color="currentColor"
            stop-opacity="0.15"
          />
          <stop
            offset="0.5"
            stop-color="currentColor"
            stop-opacity="0.3"
          />
          <stop
            offset="0.7"
            stop-color="currentColor"
            stop-opacity="0.15"
          />
          <stop
            offset="1"
            stop-color="currentColor"
            stop-opacity="0"
          />
        </linearGradient>
      </defs>
      <rect
        width="1440"
        height="2"
        fill="url(#line-gradient)"
      />
    </svg>
  </div>
</template>
