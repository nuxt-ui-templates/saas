<script setup lang="ts">
const columns = [{
  label: 'Product',
  children: [{
    label: 'Docs',
    to: '/docs'
  }, {
    label: 'Pricing',
    to: '/pricing'
  }, {
    label: 'Changelog',
    to: '/changelog'
  }]
}, {
  label: 'Resources',
  children: [{
    label: 'Blog',
    to: '/blog'
  }, {
    label: 'Nuxt UI',
    to: 'https://ui.nuxt.com',
    target: '_blank'
  }, {
    label: 'Templates',
    to: 'https://ui.nuxt.com/templates',
    target: '_blank'
  }]
}, {
  label: 'Community',
  children: [{
    label: 'GitHub',
    to: 'https://github.com/nuxt-ui-templates/saas',
    target: '_blank'
  }, {
    label: 'Discord',
    to: 'https://go.nuxt.com/discord',
    target: '_blank'
  }, {
    label: 'X',
    to: 'https://go.nuxt.com/x',
    target: '_blank'
  }]
}]

const toast = useToast()

const email = ref('')

function onSubmit() {
  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.'
  })

  email.value = ''
}
</script>

<template>
  <UFooter
    :ui="{
      root: 'relative -mt-px border-t border-default',
      top: 'py-0 lg:py-0 border-b border-default',
      container: 'border-x border-default lg:py-5',
      left: 'text-sm text-muted'
    }"
  >
    <template #top>
      <UContainer class="border-x border-default py-12 lg:py-16">
        <UFooterColumns
          :columns="columns"
          :ui="{
            root: 'lg:grid lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16 xl:grid-cols-[minmax(0,400px)_1fr] xl:gap-16',
            left: 'mb-12 lg:mb-0',
            center: 'grid grid-flow-row grid-cols-2 sm:grid-cols-3 gap-8 xl:col-span-1',
            label: 'font-mono text-xs font-normal uppercase tracking-[0.04em] text-dimmed',
            list: 'mt-4 space-y-3',
            link: 'text-[15px] text-toned hover:text-highlighted',
            linkLabelExternalIcon: 'hidden'
          }"
        >
          <template #left>
            <NuxtLink
              to="/"
              aria-label="Home"
              class="inline-flex focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1"
            >
              <AppLogo class="w-auto h-6 shrink-0" />
            </NuxtLink>

            <p class="mt-4 text-[15px]/[1.6] text-muted">
              A Nuxt UI template for shipping SaaS products.
            </p>

            <form
              class="mt-7"
              @submit.prevent="onSubmit"
            >
              <UFormField
                name="email"
                label="Subscribe to our newsletter"
                :ui="{ container: 'mt-2.5' }"
              >
                <div class="flex gap-2">
                  <UInput
                    v-model="email"
                    type="email"
                    size="xl"
                    class="flex-1"
                    placeholder="you@company.com"
                    required
                    :ui="{ base: 'py-[11px]' }"
                  />

                  <UButton
                    type="submit"
                    color="neutral"
                    size="xl"
                    label="Subscribe"
                    class="py-2.5 px-[18px] text-[15px]/6"
                  />
                </div>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        © {{ new Date().getFullYear() }} Built with Nuxt UI.
      </p>
    </template>

    <template #right>
      <ColorModeSwitcher />
    </template>
  </UFooter>
</template>
