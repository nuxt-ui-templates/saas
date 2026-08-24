export function useTodos() {
  const toast = useToast()
  const { data, status, error, refresh } = useFetch('/api/todos', {
    default: () => ({ items: [], maxItems: null as number | null })
  })

  const remaining = computed(() => data.value.maxItems === null ? null : Math.max(data.value.maxItems - data.value.items.length, 0))
  const canCreate = computed(() => data.value.maxItems === null || data.value.items.length < data.value.maxItems)

  function showError(title: string, cause: unknown) {
    toast.add({
      color: 'error',
      title,
      description: cause instanceof Error ? cause.message : 'Please try again.'
    })
  }

  watch(error, (cause) => {
    if (cause) {
      showError('Unable to load todos', cause)
    }
  })

  async function mutate(title: string, request: () => Promise<unknown>) {
    try {
      await request()
      await refresh()
      return !error.value
    } catch (cause) {
      showError(title, cause)
      return false
    }
  }

  function createTodo(title: string) {
    const value = title.trim()
    return value
      ? mutate('Unable to create todo', () => $fetch('/api/todos', { method: 'POST', body: { title: value } }))
      : Promise.resolve(false)
  }

  function deleteTodo(todoId: string) {
    return mutate('Unable to delete todo', () => $fetch(`/api/todos/${todoId}`, { method: 'DELETE' }))
  }

  return {
    items: computed(() => data.value.items),
    maxItems: computed(() => data.value.maxItems),
    remaining,
    canCreate,
    status,
    refresh,
    createTodo,
    deleteTodo
  }
}
