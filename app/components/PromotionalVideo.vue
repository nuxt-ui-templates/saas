<template>
  <div class="relative mt-8">
    <UPageCard
      variant="subtle"
      class="rounded-2xl overflow-hidden border border-[var(--ui-border)]"
    >
      <!-- Dashboard mockup -->
      <div class="relative bg-[var(--ui-bg-elevated)] rounded-xl overflow-hidden">
        <!-- Title bar -->
        <div class="flex items-center gap-2 px-4 py-3 border-b border-[var(--ui-border)]">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full bg-red-500/80" />
            <div class="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div class="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div class="flex-1 flex items-center justify-center">
            <div class="px-4 py-1 rounded-md bg-[var(--ui-bg-muted)] text-[var(--ui-text-dimmed)] text-xs font-mono">
              dashboard.saas.com
            </div>
          </div>
          <div class="w-[52px]" />
        </div>

        <!-- Dashboard content -->
        <div class="p-6 space-y-6">
          <!-- Stats row -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="stat in [
                { label: 'Deployments', value: '2,847', change: '+12%' },
                { label: 'Avg Build Time', value: '34s', change: '-48%' },
                { label: 'Edge Requests', value: '1.2M', change: '+23%' },
                { label: 'Uptime', value: '99.99%', change: '' }
              ]"
              :key="stat.label"
              class="p-4 rounded-lg bg-[var(--ui-bg-muted)] border border-[var(--ui-border)]"
            >
              <p class="text-xs text-[var(--ui-text-dimmed)] mb-1">
                {{ stat.label }}
              </p>
              <p class="text-xl font-semibold text-[var(--ui-text)] font-mono">
                {{ stat.value }}
              </p>
              <p
                v-if="stat.change"
                class="text-xs text-green-500 mt-1"
              >
                {{ stat.change }}
              </p>
            </div>
          </div>

          <!-- Deployments list -->
          <div class="rounded-lg border border-[var(--ui-border)] overflow-hidden">
            <div class="px-4 py-3 border-b border-[var(--ui-border)] bg-[var(--ui-bg-muted)]">
              <p class="text-sm font-medium text-[var(--ui-text)]">
                Recent Deployments
              </p>
            </div>
            <div
              v-for="(deployment, index) in [
                { branch: 'main', commit: 'feat: add AI gateway', status: 'ready', time: '2m ago' },
                { branch: 'main', commit: 'fix: edge function timeout', status: 'ready', time: '18m ago' },
                { branch: 'feat/auth', commit: 'refactor: session handling', status: 'building', time: '24m ago' },
              ]"
              :key="index"
              class="flex items-center justify-between px-4 py-3 border-b border-[var(--ui-border)] last:border-b-0"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="deployment.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'"
                />
                <div>
                  <p class="text-sm text-[var(--ui-text)]">
                    {{ deployment.commit }}
                  </p>
                  <p class="text-xs text-[var(--ui-text-dimmed)] font-mono">
                    {{ deployment.branch }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xs font-mono px-2 py-0.5 rounded-full border border-[var(--ui-border)] text-[var(--ui-text-dimmed)]">
                  {{ deployment.status }}
                </span>
                <p class="text-xs text-[var(--ui-text-dimmed)] mt-1">
                  {{ deployment.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UPageCard>
  </div>
</template>
