import { sql } from 'drizzle-orm'
import { z } from 'zod'

const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Todo title must be between 1 and 140 characters')
    .max(140, 'Todo title must be between 1 and 140 characters')
})

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event)
  const payload = await readValidatedBody(event, createTodoSchema.parse)
  const maxItems = await resolveTodoMaxItems(event, userId)

  const values = {
    id: crypto.randomUUID(),
    userId,
    title: payload.title
  }

  if (maxItems !== null) {
    const [inserted] = await db.all<{ id: string }>(sql`
        insert into todo_item ("id", "userId", "title")
        select ${values.id}, ${values.userId}, ${values.title}
        where (
          select count(*)
          from todo_item
          where "userId" = ${userId}
        ) < ${maxItems}
        returning "id"
      `)

    if (!inserted) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Free todo limit reached',
        data: {
          code: 'FREE_TODO_LIMIT_REACHED',
          maxItems
        }
      })
    }

    return { success: true as const }
  }

  const [inserted] = await db
    .insert(schema.todoItem)
    .values(values)
    .returning({ id: schema.todoItem.id })

  if (!inserted) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create todo'
    })
  }

  return { success: true as const }
})
