import { desc, eq } from 'drizzle-orm'
import { resolveTodoPlan } from '../../utils/todo-plan'
import { toTodoItemResponse } from '../../utils/todo-items'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const limits = await resolveTodoPlan(event)

  const todos = await db
    .select()
    .from(schema.todoItem)
    .where(eq(schema.todoItem.userId, user.id))
    .orderBy(desc(schema.todoItem.createdAt))

  const items = todos.map(toTodoItemResponse)
  const remaining = limits.maxItems === null ? null : Math.max(limits.maxItems - items.length, 0)

  return {
    items,
    limits: {
      ...limits,
      remaining
    }
  }
})
