<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer class="border-x border-default">
        <UPage>
          <template #left>
            <UPageAside class="lg:border-e lg:border-default">
              <template #top>
                <UContentSearchButton
                  :collapsed="false"
                  size="md"
                  class="w-full"
                />
              </template>

              <UContentNavigation
                :navigation="navigation"
                :collapsible="false"
                variant="pill"
                color="neutral"
                :ui="{
                  listWithChildren: 'ms-0 border-s-0',
                  itemWithChildren: 'mb-4',
                  trigger: 'font-mono text-xs font-normal uppercase tracking-wider text-dimmed',
                  linkLeadingIcon: 'hidden',
                  linkTrailingIcon: 'hidden'
                }"
              />
            </UPageAside>
          </template>

          <slot />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />
  </div>
</template>
