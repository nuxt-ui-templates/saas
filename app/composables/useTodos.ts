export function useTodos() {
  const toast = useToast()
  const { data, status, error, refresh: refreshTodos } = useFetch('/api/todos', { default: () => ({ items: [], maxItems: null as number | null }) })
  const createBody = ref({ title: '' })
  const deleteId = ref('')
  const { execute: executeCreate, error: createError } = useFetch('/api/todos', { method: 'POST', body: createBody, immediate: false, watch: false })
  const { execute: executeDelete, error: deleteError } = useFetch(() => `/api/todos/${deleteId.value}`, { method: 'DELETE', immediate: false, watch: false })

  const remaining = computed(() => data.value.maxItems === null ? null : Math.max(data.value.maxItems - data.value.items.length, 0))
  const canCreate = computed(() => data.value.maxItems === null || data.value.items.length < data.value.maxItems)

  async function refresh() {
    await refreshTodos()

    if (error.value) {
      toast.add({ color: 'error', title: 'Unable to load todos', description: error.value.message || 'Please try again.' })
      return { success: false as const }
    }

    return { success: true as const }
  }

  async function createTodo(title: string) {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return { success: false as const }

    createBody.value = { title: trimmedTitle }
    await executeCreate()

    if (createError.value) {
      toast.add({ color: 'error', title: 'Unable to create todo', description: createError.value.message || 'Please try again.' })
      return { success: false as const }
    }

    return await refresh()
  }

  async function deleteTodo(todoId: string) {
    if (!todoId) return { success: false as const }

    deleteId.value = todoId
    await executeDelete()

    if (deleteError.value) {
      toast.add({ color: 'error', title: 'Unable to delete todo', description: deleteError.value.message || 'Please try again.' })
      return { success: false as const }
    }

    return await refresh()
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
