<script setup lang="ts">
useSeoMeta({ title: 'Dashboard' })

const { user, signOut } = useUserSession()
</script>

<template>
  <UPageHero
    title="Dashboard"
    :description="`Welcome back, ${user?.name || user?.email}`"
  >
    <UButton
      label="Sign out"
      color="neutral"
      variant="outline"
      @click="signOut({ onSuccess: () => { navigateTo('/') } })"
    />
  </UPageHero>
</template>
