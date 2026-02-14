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
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
      <TemplateMenu />
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <UColorModeButton />

      <BetterAuthState>
        <template #default="{ loggedIn }">
          <template v-if="loggedIn">
            <UButton
              label="Dashboard"
              color="neutral"
              variant="outline"
              to="/app"
              class="hidden lg:inline-flex"
            />
            <UButton
              icon="i-lucide-layout-dashboard"
              color="neutral"
              variant="ghost"
              to="/app"
              class="lg:hidden"
            />
          </template>

          <template v-else>
            <UButton
              icon="i-lucide-log-in"
              color="neutral"
              variant="ghost"
              to="/login"
              class="lg:hidden"
            />
            <UButton
              label="Sign in"
              color="neutral"
              variant="outline"
              to="/login"
              class="hidden lg:inline-flex"
            />
            <UButton
              label="Sign up"
              color="neutral"
              trailing-icon="i-lucide-arrow-right"
              class="hidden lg:inline-flex"
              to="/signup"
            />
          </template>
        </template>
      </BetterAuthState>
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <BetterAuthState>
        <template #default="{ loggedIn }">
          <UButton
            v-if="loggedIn"
            label="Dashboard"
            color="neutral"
            to="/app"
            block
          />

          <template v-else>
            <UButton
              label="Sign in"
              color="neutral"
              variant="subtle"
              to="/login"
              block
              class="mb-3"
            />
            <UButton
              label="Sign up"
              color="neutral"
              to="/signup"
              block
            />
          </template>
        </template>
      </BetterAuthState>
    </template>
  </UHeader>
</template>
