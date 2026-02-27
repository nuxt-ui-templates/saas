import type { todoItem } from 'hub:db:schema'

export type TodoItem = typeof todoItem.$inferSelect
export type NewTodoItem = typeof todoItem.$inferInsert
