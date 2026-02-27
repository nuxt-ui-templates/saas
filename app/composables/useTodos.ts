function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' ? value as Record<string, unknown> : undefined
}

export function useTodos() {
  const toast = useToast()
  const createTodoTitle = ref('')
  const deleteTodoId = ref('')

  const { data, status, refresh } = useFetch('/api/todos', {
    key: 'dashboard-todos'
  })

  function showTodoError(errorTitle: string, payload: unknown, fallbackMessage?: string) {
    const errorData = asRecord(payload)
    const nestedData = asRecord(errorData?.data)
    const limitCode = (nestedData?.code ?? errorData?.code) as string | undefined
    const maxItems = typeof nestedData?.maxItems === 'number' ? nestedData.maxItems : 3
    const statusMessage = typeof errorData?.statusMessage === 'string' ? errorData.statusMessage : undefined

    if (limitCode === 'FREE_TODO_LIMIT_REACHED') {
      toast.add({
        color: 'warning',
        title: 'Free plan limit reached',
        description: `Free users can keep up to ${maxItems} todos. Upgrade to Pro for unlimited todos.`
      })
      return
    }

    toast.add({
      color: 'error',
      title: errorTitle,
      description: statusMessage || fallbackMessage || 'Please try again.'
    })
  }

  const {
    status: createTodoStatus,
    execute: executeCreateTodo
  } = useFetch('/api/todos', {
    method: 'POST',
    immediate: false,
    watch: false,
    body: () => ({ title: createTodoTitle.value }),
    onResponse: async () => {
      await refresh()
    },
    onResponseError: ({ response }) => {
      showTodoError('Unable to create todo', response._data)
    },
    onRequestError: ({ error }) => {
      showTodoError('Unable to create todo', null, error.message)
    }
  })

  const {
    status: deleteTodoStatus,
    execute: executeDeleteTodo
  } = useFetch(() => `/api/todos/${deleteTodoId.value}`, {
    method: 'DELETE',
    immediate: false,
    watch: false,
    onResponse: async () => {
      await refresh()
    },
    onResponseError: ({ response }) => {
      showTodoError('Unable to delete todo', response._data)
    },
    onRequestError: ({ error }) => {
      showTodoError('Unable to delete todo', null, error.message)
    }
  })

  const items = computed(() => data.value?.items ?? [])
  const limits = computed(() => data.value?.limits)
  const remaining = computed(() => limits.value?.remaining ?? null)
  const canCreate = computed(() => {
    const maxItems = limits.value?.maxItems
    return maxItems === undefined || maxItems === null || items.value.length < maxItems
  })
  const isMutating = computed(() => createTodoStatus.value === 'pending' || deleteTodoStatus.value === 'pending')

  async function createTodo(title: string) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return { success: false as const }
    }

    createTodoTitle.value = trimmedTitle
    await executeCreateTodo()
    return { success: createTodoStatus.value === 'success' }
  }

  async function deleteTodo(todoId: string) {
    if (!todoId) {
      return { success: false as const }
    }

    deleteTodoId.value = todoId
    await executeDeleteTodo()
    return { success: deleteTodoStatus.value === 'success' }
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
