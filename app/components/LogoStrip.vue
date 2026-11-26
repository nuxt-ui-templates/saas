<script setup lang="ts">
defineProps<{
  title: string
  items: {
    label: string
    icon: string
  }[]
}>()
</script>

<template>
  <section class="border-b border-default">
    <UContainer class="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-7 border-x border-default">
      <p class="text-sm text-muted">
        {{ title }}
      </p>

      <ul class="flex flex-wrap items-center gap-x-10 gap-y-3">
        <li
          v-for="item in items"
          :key="item.label"
          class="flex items-center gap-2 font-mono text-sm font-medium uppercase tracking-wider text-toned"
        >
          <UIcon
            :name="item.icon"
            class="size-4.5 shrink-0"
          />
          {{ item.label }}
        </li>
      </ul>
    </UContainer>
  </section>
</template>
