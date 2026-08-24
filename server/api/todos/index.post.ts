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
  const { user } = await requireUserSession(event)
  const { title } = await readValidatedBody(event, createTodoSchema.parse)
  const maxItems = await resolveTodoMaxItems(event, user.id)
  const id = crypto.randomUUID()

  const [inserted] = await db.all<{ id: string }>(sql`
    insert into todo_item (id, "userId", title)
    select ${id}, ${user.id}, ${title}
    where ${maxItems} is null or (
      select count(*) from todo_item where "userId" = ${user.id}
    ) < ${maxItems}
    returning id
  `)

  if (!inserted) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Free todo limit reached',
      data: { code: 'FREE_TODO_LIMIT_REACHED', maxItems }
    })
  }

  return { success: true as const }
})
