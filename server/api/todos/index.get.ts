import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event)
  const maxItems = await resolveTodoMaxItems(event, userId)

  const items = await db
    .select({
      id: schema.todoItem.id,
      title: schema.todoItem.title
    })
    .from(schema.todoItem)
    .where(eq(schema.todoItem.userId, userId))
    .orderBy(desc(schema.todoItem.createdAt))

  return {
    items,
    maxItems
  }
})
