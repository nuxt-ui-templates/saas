import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const maxItems = await resolveTodoMaxItems(event, user.id)

  const items = await db
    .select({
      id: schema.todoItem.id,
      title: schema.todoItem.title
    })
    .from(schema.todoItem)
    .where(eq(schema.todoItem.userId, user.id))
    .orderBy(desc(schema.todoItem.createdAt))

  return {
    items,
    maxItems
  }
})
