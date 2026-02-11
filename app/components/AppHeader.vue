<script setup lang="ts">
const route = useRoute()

const items = computed(() => [{
  label: 'Docs',
  to: '/docs',
  active: route.path.startsWith('/docs')
}, {
  label: 'Pricing',
  to: '/pricing'
}, {
  label: 'Blog',
  to: '/blog'
}, {
  label: 'Changelog',
  to: '/changelog'
}])
</script>

<template>
  <UHeader :ui="{ root: 'border-b border-[var(--ui-border)]' }">
    <template #left>
      <NuxtLink
        to="/"
        class="flex items-center gap-2"
      >
        <AppLogo class="w-auto h-5 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      :ui="{
        link: 'text-sm font-normal text-[var(--ui-text-muted)] hover:text-[var(--ui-text)] transition-colors'
      }"
    />

    <template #right>
      <UColorModeButton size="sm" />

      <UButton
        icon="i-lucide-log-in"
        color="neutral"
        variant="ghost"
        to="/login"
        class="lg:hidden"
        size="sm"
      />

      <UButton
        label="Log In"
        color="neutral"
        variant="ghost"
        to="/login"
        class="hidden lg:inline-flex"
        size="sm"
        :ui="{ label: 'text-sm font-normal' }"
      />

      <UButton
        label="Sign Up"
        color="neutral"
        to="/signup"
        class="hidden lg:inline-flex"
        size="sm"
        :ui="{ label: 'text-sm font-medium' }"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <UButton
        label="Log In"
        color="neutral"
        variant="subtle"
        to="/login"
        block
        class="mb-3"
      />
      <UButton
        label="Sign Up"
        color="neutral"
        to="/signup"
        block
      />
    </template>
  </UHeader>
</template>
