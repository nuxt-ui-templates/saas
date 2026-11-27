<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <UContainer class="border-x border-default lg:px-0">
        <UPage :ui="{ root: 'lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-0', left: 'lg:col-span-1', center: 'lg:col-span-1' }">
          <template #left>
            <UPageAside
              class="lg:border-e lg:border-default"
              :ui="{ root: 'lg:ms-0 lg:px-5', topHeader: 'mx-0 px-0', topBody: 'mx-0 px-0', topFooter: 'mx-0 px-0' }"
            >
              <template #top>
                <UContentSearchButton
                  :collapsed="false"
                  label="Search"
                  size="lg"
                  class="w-full rounded-lg bg-surface ring-default text-sm text-dimmed"
                />
              </template>

              <UContentNavigation
                :navigation="navigation"
                :collapsible="false"
                variant="pill"
                color="neutral"
                :ui="{
                  listWithChildren: 'ms-0 border-s-0',
                  itemWithChildren: 'mb-6 data-[state=open]:mb-6',
                  trigger: 'px-2.5 font-mono text-xs font-normal uppercase tracking-[0.04em] text-dimmed!',
                  link: 'px-2.5 py-1.5 text-sm gap-2 before:rounded-lg aria-[current=page]:font-medium aria-[current=page]:after:-order-1 aria-[current=page]:after:size-1.5 aria-[current=page]:after:bg-primary',
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
