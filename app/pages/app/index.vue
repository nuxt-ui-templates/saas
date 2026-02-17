<script setup lang="ts">
useSeoMeta({ title: 'Dashboard' })

const { user, signOut } = useUserSession()

async function handleSignOut() {
  await signOut({
    onSuccess: async () => {
      await navigateTo('/')
    }
  })
}
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
      @click="handleSignOut"
    />
  </UPageHero>
</template>
