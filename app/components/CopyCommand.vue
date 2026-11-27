<script setup lang="ts">
defineProps<{
  command: string
}>()

const { copy, copied } = useClipboard({ legacy: true })
</script>

<template>
  <div class="inline-flex items-center gap-2 max-w-full ps-4 pe-1 py-1 rounded-md border border-dashed border-accented font-mono text-sm">
    <span
      aria-hidden="true"
      class="text-dimmed select-none"
    >$</span>

    <code class="min-w-0 text-highlighted truncate">{{ command }}</code>

    <UButton
      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
      :aria-label="copied ? 'Copied' : 'Copy command'"
      color="neutral"
      variant="ghost"
      @click="copy(command)"
    />
  </div>
</template>
