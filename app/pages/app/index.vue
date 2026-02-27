<script setup lang="ts">
useSeoMeta({ title: 'Dashboard' })

const route = useRoute()
const { productSlug } = useRuntimeConfig().public.polar
const { user, loggedIn, signOut } = useUserSession()
const toast = useToast()
const checkout = useAuthClientAction(client => client.checkout)
const portal = useAuthClientAction(client => client.customer.portal)
const customerState = useAuthClientAction(client => client.customer.state)

watchEffect(() => {
  if (!loggedIn.value || customerState.status.value !== 'idle') {
    return
  }

  customerState.execute()
})

const polarCustomerState = computed(() => customerState.data.value?.data)

const isSubscribed = computed(() => {
  if (customerState.error.value) {
    return false
  }

  return (polarCustomerState.value?.activeSubscriptions?.length ?? 0) > 0
})

const isSubscriptionResolving = computed(() => loggedIn.value && (
  customerState.status.value === 'idle' || customerState.status.value === 'pending'
))

function showBillingError(title: string, error: unknown) {
  toast.add({
    color: 'error',
    title,
    description: resolveAuthErrorMessage(error)
  })
}

async function onManageSubscription() {
  await portal.execute()

  if (portal.status.value === 'error') {
    showBillingError('Unable to open portal', portal.error.value)
  }
}

async function onUpgradeToPro() {
  if (isSubscribed.value) {
    await onManageSubscription()
    return
  }

  await checkout.execute({ slug: productSlug })

  if (checkout.status.value === 'error') {
    showBillingError('Unable to start checkout', checkout.error.value)
  }
}

const {
  items: todoItems,
  limits: todoLimits,
  remaining: todoRemaining,
  canCreate: canCreateTodo,
  status: todoStatus,
  isMutating: isTodoMutating,
  refresh: refreshTodos,
  createTodo,
  deleteTodo
} = useTodos()

const newTodoTitle = ref('')

const isTodoLoading = computed(() => todoStatus.value === 'pending')
const todoPlan = computed(() => todoLimits.value?.plan)
const todoMaxItems = computed(() => todoLimits.value?.maxItems ?? null)
const isFreeTodoPlan = computed(() => todoPlan.value === 'free')
const isTodoLimitReached = computed(() => isFreeTodoPlan.value && !canCreateTodo.value)
const pendingTodoCount = computed(() => todoItems.value.length)
const todoCountLabel = computed(() => `${pendingTodoCount.value} pending task${pendingTodoCount.value === 1 ? '' : 's'}`)

watch(
  () => [isSubscribed.value, todoPlan.value] as const,
  async ([subscribed, todoPlan]) => {
    if (subscribed && todoPlan === 'free') {
      await refreshTodos()
    }
  },
  { immediate: true }
)

const dashboardItems = computed(() => [[{
  label: 'Overview',
  icon: 'i-lucide-layout-dashboard',
  to: '/app',
  active: route.path === '/app'
}, {
  label: 'Analytics',
  icon: 'i-lucide-bar-chart-3',
  disabled: true
}, {
  label: 'Members',
  icon: 'i-lucide-users',
  disabled: true
}, {
  label: 'Billing',
  icon: 'i-lucide-credit-card',
  to: '/pricing'
}]])

async function onCreateTodo() {
  const result = await createTodo(newTodoTitle.value)

  if (result.success) {
    newTodoTitle.value = ''
  }
}

async function onDeleteTodo(todoId: string) {
  await deleteTodo(todoId)
}
</script>

<template>
  <UContainer class="py-8">
    <UPage>
      <template #left>
        <UPageAside>
          <template #top>
            <UPageCard variant="subtle">
              <p class="text-sm font-medium text-highlighted">
                {{ user?.name || 'User' }}
              </p>
              <p class="text-xs text-muted mt-1 break-all">
                {{ user?.email }}
              </p>
            </UPageCard>
          </template>

          <UNavigationMenu
            orientation="vertical"
            :items="dashboardItems"
          />

          <USeparator class="my-4" />

          <BetterAuthState>
            <template #default>
              <div class="space-y-2">
                <template v-if="isSubscriptionResolving">
                  <div class="h-10 rounded-md bg-elevated animate-pulse" />
                  <div class="h-10 rounded-md bg-elevated animate-pulse" />
                </template>

                <template v-else>
                  <UButton
                    v-if="isSubscribed"
                    label="Pro plan active"
                    icon="i-lucide-badge-check"
                    color="success"
                    variant="soft"
                    disabled
                    block
                  />
                  <UButton
                    v-else
                    label="Upgrade to Pro"
                    icon="i-lucide-sparkles"
                    color="primary"
                    block
                    @click="onUpgradeToPro"
                  />
                  <UButton
                    :label="isSubscribed ? 'Manage subscription' : 'Billing portal'"
                    icon="i-lucide-receipt-text"
                    color="neutral"
                    variant="soft"
                    block
                    @click="onManageSubscription"
                  />
                </template>
              </div>
            </template>

            <template #placeholder>
              <div class="space-y-2">
                <div class="h-10 rounded-md bg-elevated animate-pulse" />
                <div class="h-10 rounded-md bg-elevated animate-pulse" />
              </div>
            </template>
          </BetterAuthState>

          <USeparator class="my-4" />

          <UButton
            label="Sign out"
            color="neutral"
            variant="outline"
            icon="i-lucide-log-out"
            block
            @click="() => signOut()"
          />
        </UPageAside>
      </template>

      <UPageBody>
        <UPageHeader
          title="Dashboard"
          :description="`Welcome back, ${user?.name || user?.email}`"
        />

        <UPageGrid>
          <UPageCard
            title="Users"
            description="1 active account"
            icon="i-lucide-users"
          />
          <UPageCard
            title="Revenue"
            description="$0 this month"
            icon="i-lucide-credit-card"
          />
          <UPageCard
            title="Tasks"
            :description="isTodoLoading ? 'Loading tasks...' : todoCountLabel"
            icon="i-lucide-list-checks"
          />
        </UPageGrid>

        <UPageCard
          title="Todo list"
          description="Each user has one list. Free users can create up to 3 todos."
          icon="i-lucide-list-todo"
          class="mt-6"
        >
          <div class="space-y-4">
            <div class="flex flex-col gap-2 sm:flex-row">
              <UInput
                v-model="newTodoTitle"
                placeholder="Add a todo"
                class="flex-1"
                :disabled="isTodoMutating || isTodoLimitReached"
                @keydown.enter.prevent="onCreateTodo"
              />
              <UButton
                label="Add"
                icon="i-lucide-plus"
                color="primary"
                :loading="isTodoMutating"
                :disabled="!newTodoTitle.trim() || isTodoLimitReached"
                @click="onCreateTodo"
              />
            </div>

            <div class="flex flex-wrap items-center gap-2 text-xs text-muted">
              <UBadge
                :label="todoPlan === 'pro' ? 'Pro plan' : 'Free plan'"
                :color="todoPlan === 'pro' ? 'success' : 'neutral'"
                variant="soft"
              />
              <span v-if="todoMaxItems !== null">
                {{ todoRemaining }} of {{ todoMaxItems }} slots left
              </span>
              <span v-else>
                Unlimited todos
              </span>
            </div>

            <div
              v-if="isTodoLoading"
              class="space-y-2"
            >
              <div class="h-9 rounded-md bg-elevated animate-pulse" />
              <div class="h-9 rounded-md bg-elevated animate-pulse" />
            </div>

            <ul
              v-else-if="todoItems.length"
              class="space-y-2"
            >
              <li
                v-for="todo in todoItems"
                :key="todo.id"
                class="flex items-center gap-3 rounded-md border border-default px-3 py-2"
              >
                <span
                  class="flex-1 text-sm text-highlighted"
                >
                  {{ todo.title }}
                </span>
                <UButton
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  :disabled="isTodoMutating"
                  @click="onDeleteTodo(todo.id)"
                />
              </li>
            </ul>

            <p
              v-else
              class="text-sm text-muted"
            >
              No todos yet. Create your first one.
            </p>

            <div
              v-if="isTodoLimitReached"
              class="flex flex-col gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-sm text-highlighted">
                Free plan limit reached. Upgrade to Pro for unlimited todos.
              </p>
              <UButton
                to="/pricing"
                label="Upgrade to Pro"
                icon="i-lucide-sparkles"
                color="primary"
                size="sm"
              />
            </div>
          </div>
        </UPageCard>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
