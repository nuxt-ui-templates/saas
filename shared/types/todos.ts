import type { TodoItem } from './todo-item'

export type TodoPlan = 'free' | 'pro'

export interface TodoPlanLimits {
  plan: TodoPlan
  maxItems: number | null
}

export type TodoListItem = Pick<TodoItem, 'id' | 'title' | 'completed' | 'createdAt' | 'updatedAt'>

export interface TodosResponse {
  items: TodoListItem[]
  limits: TodoPlanLimits & {
    remaining: number | null
  }
}
