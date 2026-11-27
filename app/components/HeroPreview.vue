<script setup lang="ts">
const items = [{
  label: 'Overview',
  icon: 'i-lucide-house',
  active: true
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  count: 4
}, {
  label: 'Customers',
  icon: 'i-lucide-users'
}, {
  label: 'Analytics',
  icon: 'i-lucide-chart-column'
}, {
  label: 'Settings',
  icon: 'i-lucide-settings'
}]

const stats = [{
  label: 'Revenue',
  value: '$48,210',
  variation: '+12.4%'
}, {
  label: 'Customers',
  value: '1,284',
  variation: '+86'
}, {
  label: 'Churn',
  value: '1.9%',
  variation: '-0.3%'
}]

const bars = [38, 42, 40, 51, 47, 55, 52, 60, 58, 64, 61, 70, 66, 72, 69, 78, 74, 82, 79, 88, 84, 92, 90, 100]
</script>

<template>
  <div
    aria-hidden="true"
    class="-mb-px rounded-t-xl border border-b-0 border-default bg-surface overflow-hidden shadow-2xl shadow-neutral-950/10 select-none"
  >
    <div class="flex items-center gap-3 h-11 px-4 border-b border-muted">
      <div class="flex gap-1.5">
        <span
          v-for="i in 3"
          :key="i"
          class="size-2.5 rounded-full bg-accented"
        />
      </div>

      <div class="flex-1 flex justify-center">
        <span class="px-3.5 py-1 rounded-md bg-elevated font-mono text-xs text-muted">
          app.acme.dev/overview
        </span>
      </div>

      <div class="w-10" />
    </div>

    <div class="flex min-h-96">
      <div class="hidden md:flex flex-col gap-0.5 w-56 shrink-0 p-3 border-e border-muted text-sm">
        <div class="flex items-center gap-2.5 px-2 pt-1.5 pb-3.5">
          <span class="grid place-items-center size-6 rounded-md bg-primary text-primary-950 text-xs font-semibold">L</span>
          <span class="font-medium text-highlighted">Lumen Labs</span>
        </div>

        <div
          v-for="item in items"
          :key="item.label"
          class="flex items-center gap-2.5 p-2 rounded-md"
          :class="item.active ? 'bg-elevated text-highlighted font-medium' : 'text-muted'"
        >
          <UIcon
            :name="item.icon"
            class="size-4 shrink-0"
          />
          {{ item.label }}
          <span
            v-if="item.count"
            class="ms-auto font-mono text-xs"
          >{{ item.count }}</span>
        </div>
      </div>

      <div class="flex-1 min-w-0 flex flex-col gap-5 p-4 sm:p-6">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xl font-semibold tracking-tight text-highlighted">
              Overview
            </p>
            <p class="text-sm text-muted">
              Demo data
            </p>
          </div>

          <span class="inline-flex items-center gap-2 h-8 px-3 rounded-md ring ring-default text-sm text-muted">
            Last 30 days
            <UIcon
              name="i-lucide-chevron-down"
              class="size-3.5"
            />
          </span>
        </div>

        <div class="grid sm:grid-cols-3 gap-3">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-lg ring ring-default px-4 py-3.5"
          >
            <p class="text-sm text-muted">
              {{ stat.label }}
            </p>
            <p class="mt-1.5 text-2xl font-semibold tracking-tight text-highlighted">
              {{ stat.value }}
            </p>
            <p class="mt-1 font-mono text-xs text-toned">
              {{ stat.variation }}
            </p>
          </div>
        </div>

        <div class="rounded-lg ring ring-default p-4">
          <p class="mb-3 text-sm text-muted">
            Monthly recurring revenue
          </p>

          <div class="flex items-end gap-1 sm:gap-1.5 h-40">
            <div
              v-for="(bar, index) in bars"
              :key="index"
              class="flex-1 rounded-xs"
              :class="index === bars.length - 1 ? 'bg-primary' : index >= bars.length - 5 ? 'bg-(--ui-border-accented)' : 'bg-accented'"
              :style="{ height: `${bar}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
