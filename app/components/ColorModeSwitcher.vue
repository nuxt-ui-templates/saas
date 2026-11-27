<script setup lang="ts">
const colorMode = useColorMode()

const modes = [{
  value: 'system',
  label: 'System theme',
  icon: 'i-lucide-monitor'
}, {
  value: 'light',
  label: 'Light theme',
  icon: 'i-lucide-sun'
}, {
  value: 'dark',
  label: 'Dark theme',
  icon: 'i-lucide-moon'
}]
</script>

<template>
  <ClientOnly>
    <div
      role="group"
      aria-label="Color mode"
      class="inline-flex gap-0.5 p-[3px] rounded-full ring ring-default bg-surface"
    >
      <UButton
        v-for="mode in modes"
        :key="mode.value"
        :icon="mode.icon"
        :aria-label="mode.label"
        :aria-pressed="colorMode.preference === mode.value"
        color="neutral"
        :variant="colorMode.preference === mode.value ? 'soft' : 'ghost'"
        size="sm"
        class="rounded-full p-2"
        @click="colorMode.preference = mode.value"
      />
    </div>

    <template #fallback>
      <div class="h-8 w-24 rounded-full ring ring-default" />
    </template>
  </ClientOnly>
</template>
