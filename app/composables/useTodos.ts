import type { FetchError } from 'ofetch'

interface TodoItem {
  id: string
  title: string
  completed: boolean
  createdAt: string | number
  updatedAt: string | number
}

interface TodoLimits {
  plan: 'free' | 'pro'
  maxItems: number | null
  remaining: number | null
}

interface TodosResponse {
  items: TodoItem[]
  limits: TodoLimits
}

interface ApiErrorData {
  statusCode?: number
  statusMessage?: string
  data?: {
    code?: string
    maxItems?: number
  }
  code?: string
}

const DEFAULT_LIMITS: TodoLimits = {
  plan: 'free',
  maxItems: 3,
  remaining: 3
}

export function useTodos() {
  const toast = useToast()
  const isMutating = ref(false)

  const { data, status, refresh } = useFetch<TodosResponse>('/api/todos', {
    key: 'dashboard-todos',
    default: () => ({
      items: [],
      limits: DEFAULT_LIMITS
    })
  })

  const items = computed(() => data.value?.items || [])
  const limits = computed(() => data.value?.limits || DEFAULT_LIMITS)
  const remaining = computed(() => limits.value.remaining)
  const canCreate = computed(() => limits.value.maxItems === null || items.value.length < limits.value.maxItems)

  async function handleMutation<T>(operation: () => Promise<T>, errorTitle: string) {
    isMutating.value = true

    try {
      const result = await operation()
      await refresh()
      return { success: true, result }
    } catch (error) {
      const fetchError = error as FetchError<ApiErrorData>
      const errorData = fetchError.data
      const limitCode = errorData?.data?.code || errorData?.code

      if (limitCode === 'FREE_TODO_LIMIT_REACHED') {
        toast.add({
          color: 'warning',
          title: 'Free plan limit reached',
          description: `Free users can keep up to ${errorData?.data?.maxItems || 3} todos. Upgrade to Pro for unlimited todos.`
        })
      } else {
        toast.add({
          color: 'error',
          title: errorTitle,
          description: errorData?.statusMessage || fetchError.message || 'Please try again.'
        })
      }

      return { success: false }
    } finally {
      isMutating.value = false
    }
  }

  async function createTodo(title: string) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return { success: false as const }
    }

    return handleMutation(
      () => $fetch('/api/todos', {
        method: 'POST',
        body: { title: trimmedTitle }
      }),
      'Unable to create todo'
    )
  }

  async function toggleTodo(todoId: string, completed: boolean) {
    return handleMutation(
      () => $fetch(`/api/todos/${todoId}`, {
        method: 'PATCH',
        body: { completed }
      }),
      'Unable to update todo'
    )
  }

  async function deleteTodo(todoId: string) {
    return handleMutation(
      () => $fetch(`/api/todos/${todoId}`, {
        method: 'DELETE'
      }),
      'Unable to delete todo'
    )
  }

  return {
    items,
    limits,
    remaining,
    canCreate,
    status,
    isMutating,
    refresh,
    createTodo,
    toggleTodo,
    deleteTodo
  }
}
