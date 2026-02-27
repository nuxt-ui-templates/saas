import type { todoItem } from 'hub:db:schema'

export type TodoItemModel = typeof todoItem.$inferSelect
