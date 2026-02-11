<script setup lang="ts">
const columns = [{
  label: 'Product',
  children: [{
    label: 'Previews'
  }, {
    label: 'Infrastructure'
  }, {
    label: 'AI'
  }, {
    label: 'Enterprise'
  }]
}, {
  label: 'Resources',
  children: [{
    label: 'Docs'
  }, {
    label: 'Guides'
  }, {
    label: 'Changelog'
  }, {
    label: 'Pricing'
  }]
}, {
  label: 'Company',
  children: [{
    label: 'About'
  }, {
    label: 'Blog'
  }, {
    label: 'Careers'
  }, {
    label: 'Contact'
  }]
}]

const toast = useToast()

const email = ref('')

function onSubmit() {
  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.'
  })
}
</script>

<template>
  <USeparator class="opacity-50" />

  <UFooter :ui="{ top: 'border-b border-[var(--ui-border)]' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="Subscribe to our newsletter"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="you@domain.com"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      color="neutral"
                      label="Subscribe"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-[var(--ui-text-dimmed)] text-sm">
        {{ '\u00A9' }} {{ new Date().getFullYear() }} Your Company, Inc.
      </p>
    </template>

    <template #right>
      <UButton
        to="https://github.com/nuxt-ui-templates/saas"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
        size="sm"
      />
      <UButton
        to="https://go.nuxt.com/x"
        target="_blank"
        icon="i-simple-icons-x"
        aria-label="X"
        color="neutral"
        variant="ghost"
        size="sm"
      />
      <UButton
        to="https://go.nuxt.com/discord"
        target="_blank"
        icon="i-simple-icons-discord"
        aria-label="Discord"
        color="neutral"
        variant="ghost"
        size="sm"
      />
    </template>
  </UFooter>
</template>
