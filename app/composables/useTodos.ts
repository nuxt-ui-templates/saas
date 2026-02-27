export function useTodos() {
  const toast = useToast()
  const { data, status, error, refresh: refreshTodos } = useFetch('/api/todos')
  const createTodoAction = useAction(async (title: string) => await $fetch('/api/todos', {
    method: 'POST',
    body: { title }
  }))
  const deleteTodoAction = useAction(async (todoId: string) => await $fetch(`/api/todos/${todoId}`, {
    method: 'DELETE'
  }))

  const items = computed(() => data.value?.items ?? [])
  const maxItems = computed(() => data.value?.maxItems ?? null)
  const remaining = computed(() => maxItems.value === null ? null : Math.max(maxItems.value - items.value.length, 0))
  const canCreate = computed(() => maxItems.value === null || items.value.length < maxItems.value)

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
    await refreshTodos()

    if (error.value) {
      showError('Unable to load todos', error.value)
      return { success: false as const }
    }

    return { success: true as const }
  }

  async function createTodo(title: string) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return { success: false as const }
    }

    await createTodoAction.execute(trimmedTitle)

    if (createTodoAction.status.value === 'error') {
      showError('Unable to create todo', createTodoAction.error.value)
      return { success: false as const }
    }

    return await refresh()
  }

  async function deleteTodo(todoId: string) {
    if (!todoId) {
      return { success: false as const }
    }

    await deleteTodoAction.execute(todoId)

    if (deleteTodoAction.status.value === 'error') {
      showError('Unable to delete todo', deleteTodoAction.error.value)
      return { success: false as const }
    }

    return await refresh()
  }

  return {
    items,
    maxItems,
    remaining,
    canCreate,
    status,
    refresh,
    createTodo,
    deleteTodo
  }
}
