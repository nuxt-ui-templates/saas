import type { todoItem } from 'hub:db:schema'

type TodoItemModel = typeof todoItem.$inferSelect

export interface TodoItemResponse {
  id: string
  title: string
  completed: boolean
  createdAt: string | number
  updatedAt: string | number
}

function normalizeDateValue(value: Date | number): string | number {
  return value instanceof Date ? value.toISOString() : value
}

export function toTodoItemResponse(item: TodoItemModel): TodoItemResponse {
  return {
    id: item.id,
    title: item.title,
    completed: item.completed,
    createdAt: normalizeDateValue(item.createdAt),
    updatedAt: normalizeDateValue(item.updatedAt)
  }
}
