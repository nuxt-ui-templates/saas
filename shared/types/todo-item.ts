import type { todoItem } from 'hub:db:schema'

export type TodoItemModel = typeof todoItem.$inferSelect
export type TodoItem = TodoItemModel
