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

  const query = sql<{ id: string }>`
    insert into todo_item (id, "userId", title)
    select ${id}, ${user.id}, ${title}
    where ${maxItems === null
      ? sql`true`
      : sql`(select count(*) from todo_item where "userId" = ${user.id}) < ${maxItems}`}
    returning id
  `
  type QueryExecutor = (rawQuery: typeof query) => Promise<Array<{ id: string }>>
  const rawDb = db as unknown as { all?: QueryExecutor, execute?: QueryExecutor }
  const executeQuery = rawDb.all ?? rawDb.execute

  if (!executeQuery) {
    throw new Error('Database does not support raw queries')
  }

  const [inserted] = await executeQuery.call(db, query)

  if (!inserted) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Free todo limit reached',
      data: { code: 'FREE_TODO_LIMIT_REACHED', maxItems }
    })
  }

  return { success: true as const }
})
