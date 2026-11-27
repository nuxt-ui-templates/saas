<script setup lang="ts">
defineProps<{
  name: 'components' | 'auth' | 'typescript' | 'tokens' | 'accessibility' | 'color-mode'
}>()

const swatches = ['bg-primary', 'bg-inverted', 'bg-neutral-600', 'bg-neutral-400', 'bg-accented', 'bg-default ring ring-inset ring-default']
</script>

<template>
  <div
    inert
    aria-hidden="true"
    class="w-full h-42 rounded-xl ring ring-default bg-surface overflow-hidden select-none"
  >
    <div
      v-if="name === 'components'"
      class="h-full flex flex-wrap content-center justify-center gap-2.5 p-4"
    >
      <UButton
        label="Button"
        color="neutral"
      />
      <UButton
        label="Outline"
        color="neutral"
        variant="outline"
      />
      <UBadge
        label="Badge"
        color="primary"
        variant="soft"
        class="self-center"
      />
      <USwitch
        :model-value="true"
        class="self-center"
      />
      <USelect
        placeholder="Select plan"
        :items="['Basic', 'Standard', 'Premium']"
        class="w-40"
      />
      <UCheckbox
        :model-value="true"
        class="self-center"
      />
    </div>

    <div
      v-else-if="name === 'auth'"
      class="h-full grid place-items-center p-4"
    >
      <div class="w-full max-w-60 space-y-3">
        <UFormField label="Email">
          <UInput
            model-value="you@company.com"
            class="w-full"
          />
        </UFormField>
        <UButton
          label="Continue"
          color="neutral"
          block
        />
      </div>
    </div>

    <div
      v-else-if="name === 'typescript'"
      class="relative h-full p-5 bg-neutral-950 font-mono text-sm/7 text-neutral-400"
    >
      <p>
        <span class="text-info-300">&lt;UButton</span>
        <span class="text-neutral-200"> color</span>=<span class="text-primary-300">"</span><span class="bg-neutral-700 text-neutral-50">|</span><span class="text-primary-300">"</span>
        <span class="text-info-300"> /&gt;</span>
      </p>

      <ul class="absolute left-31 top-13 w-40 p-1 rounded-md ring ring-neutral-700 bg-neutral-900">
        <li class="px-2 rounded-sm bg-neutral-800 text-neutral-50">
          primary
        </li>
        <li class="px-2">
          secondary
        </li>
        <li class="px-2">
          neutral
        </li>
        <li class="px-2">
          success
        </li>
      </ul>
    </div>

    <div
      v-else-if="name === 'tokens'"
      class="h-full flex flex-col justify-center gap-2.5 p-5"
    >
      <div class="grid grid-cols-6 gap-1.5">
        <span
          v-for="swatch in swatches"
          :key="swatch"
          class="h-11 rounded-md"
          :class="swatch"
        />
      </div>

      <div class="grid grid-cols-3 gap-1.5 font-mono text-xs text-muted">
        <span>--ui-primary</span>
        <span>--ui-text</span>
        <span>--ui-bg</span>
      </div>
    </div>

    <div
      v-else-if="name === 'accessibility'"
      class="h-full flex items-center justify-center gap-3.5 p-4"
    >
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
      />
      <UButton
        label="Save changes"
        color="neutral"
        class="outline-2 outline-offset-3 outline-inverted"
      />
      <UKbd
        value="Tab"
        size="lg"
      />
    </div>

    <div
      v-else
      class="h-full grid grid-cols-2"
    >
      <div class="flex flex-col gap-2 p-5 bg-white">
        <UIcon
          name="i-lucide-sun"
          class="size-4.5 text-neutral-900"
        />
        <span class="mt-auto h-2 w-4/5 rounded-full bg-neutral-200" />
        <span class="h-2 w-1/2 rounded-full bg-neutral-200" />
        <span class="h-6 w-16 rounded-md bg-neutral-900" />
      </div>
      <div class="flex flex-col gap-2 p-5 bg-neutral-950">
        <UIcon
          name="i-lucide-moon"
          class="size-4.5 text-white"
        />
        <span class="mt-auto h-2 w-4/5 rounded-full bg-neutral-800" />
        <span class="h-2 w-1/2 rounded-full bg-neutral-800" />
        <span class="h-6 w-16 rounded-md bg-primary" />
      </div>
    </div>
  </div>
</template>
