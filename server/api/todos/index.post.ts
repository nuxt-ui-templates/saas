import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'

const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Todo title must be between 1 and 140 characters')
    .max(140, 'Todo title must be between 1 and 140 characters')
})

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { title } = await readValidatedBody(event, createTodoSchema.parse)
  const maxItems = await resolveTodoMaxItems(event, user.id)

  if (maxItems !== null) {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.todoItem).where(eq(schema.todoItem.userId, user.id))

    if (count >= maxItems) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Free todo limit reached',
        data: { code: 'FREE_TODO_LIMIT_REACHED', maxItems }
      })
    }

    await db.insert(schema.todoItem).values({ userId: user.id, title })
    return { success: true as const }
  }

  await db.insert(schema.todoItem).values({ userId: user.id, title })
  return { success: true as const }
})
