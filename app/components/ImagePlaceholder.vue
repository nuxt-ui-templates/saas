<template>
  <UPageCard
    variant="subtle"
    class="border border-[var(--ui-border)]"
  >
    <div class="relative overflow-hidden rounded-sm bg-[var(--ui-bg-elevated)] px-4 flex items-center justify-center aspect-video">
      <!-- Subtle grid pattern -->
      <svg
        class="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <pattern
            id="placeholder-grid"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1"
              cy="1"
              r="0.5"
              fill="currentColor"
              opacity="0.15"
            />
          </pattern>
        </defs>
        <rect
          fill="url(#placeholder-grid)"
          width="100%"
          height="100%"
        />
      </svg>

      <!-- Centered terminal mockup -->
      <div class="relative z-10 w-full max-w-sm rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] overflow-hidden shadow-lg">
        <div class="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--ui-border)]">
          <div class="w-2 h-2 rounded-full bg-red-500/60" />
          <div class="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div class="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
        <div class="p-4 font-mono text-xs space-y-2">
          <p class="text-[var(--ui-text-dimmed)]">
            <span class="text-green-500">$</span> git push origin main
          </p>
          <p class="text-[var(--ui-text-dimmed)]">
            Deploying to production...
          </p>
          <p class="text-green-500">
            Ready https://app.example.com
          </p>
        </div>
      </div>

      <slot />
    </div>
  </UPageCard>
</template>
