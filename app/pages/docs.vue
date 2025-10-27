<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <div>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <template #top>
              <UContentSearchButton :collapsed="false" />
            </template>

            <UContentNavigation
              :navigation="navigation"
              highlight
            />
          </UPageAside>
        </template>

        <NuxtPage />
      </UPage>
    </UContainer>
  </div>
</template>
