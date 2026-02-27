import type { TodosResponse } from '~~/shared/types/todos'

type TodoItem = TodosResponse['items'][number]
type TodoLimits = TodosResponse['limits']

export function useTodos() {
  const toast = useToast()
  const items = useState<TodoItem[]>('todos:items', () => [])
  const limits = useState<TodoLimits | null>('todos:limits', () => null)
  const status = useState<'idle' | 'pending' | 'success' | 'error'>('todos:status', () => 'idle')
  const isMutating = useState('todos:is-mutating', () => false)

  const remaining = computed(() => limits.value?.remaining ?? null)
  const canCreate = computed(() => limits.value?.maxItems == null || items.value.length < limits.value.maxItems)

  function showError(title: string, error: unknown) {
    const payload = error as { data?: { statusMessage?: string } }
    const message = payload.data?.statusMessage || (error instanceof Error ? error.message : 'Please try again.')

    toast.add({
      color: 'error',
      title,
      description: message
    })
  }

  async function refresh() {
    status.value = 'pending'

    try {
      const response = await $fetch('/api/todos')
      items.value = response.items ?? []
      limits.value = response.limits ?? null
      status.value = 'success'
    } catch (error) {
      status.value = 'error'
      showError('Unable to load todos', error)
    }
  }

  async function createTodo(title: string) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return { success: false as const }
    }

    isMutating.value = true

    try {
      await $fetch('/api/todos', {
        method: 'POST',
        body: { title: trimmedTitle }
      })

      await refresh()
      return { success: true as const }
    } catch (error) {
      showError('Unable to create todo', error)
      return { success: false as const }
    } finally {
      isMutating.value = false
    }
  }

  async function deleteTodo(todoId: string) {
    if (!todoId) {
      return { success: false as const }
    }

    isMutating.value = true

    try {
      await $fetch(`/api/todos/${todoId}`, {
        method: 'DELETE'
      })

      await refresh()
      return { success: true as const }
    } catch (error) {
      showError('Unable to delete todo', error)
      return { success: false as const }
    } finally {
      isMutating.value = false
    }
  }

  if (status.value === 'idle') {
    refresh()
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
    deleteTodo
  }
}
