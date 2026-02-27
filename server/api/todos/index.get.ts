import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event)
  const limits = await resolveTodoPlan(event)

  const items = await db
    .select({
      id: schema.todoItem.id,
      title: schema.todoItem.title,
      completed: schema.todoItem.completed,
      createdAt: schema.todoItem.createdAt,
      updatedAt: schema.todoItem.updatedAt
    })
    .from(schema.todoItem)
    .where(eq(schema.todoItem.userId, userId))
    .orderBy(desc(schema.todoItem.createdAt))

  const remaining = limits.maxItems === null ? null : Math.max(limits.maxItems - items.length, 0)

  return {
    items,
    limits: {
      ...limits,
      remaining
    }
  }
})
