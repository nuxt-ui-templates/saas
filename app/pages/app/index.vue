<script setup lang="ts">
useSeoMeta({ title: 'Dashboard' })

const { user, signOut } = useUserSession()
</script>

<template>
  <UPageHero
    title="Dashboard"
    :description="user ? `Welcome back, ${user.name || user.email}` : undefined"
  >
    <UButton
      label="Sign out"
      color="neutral"
      variant="outline"
      @click="() => signOut()"
    />
  </UPageHero>
</template>
