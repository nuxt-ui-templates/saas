import { sql, type SQL } from 'drizzle-orm'
import { z } from 'zod'

type TodoInsert = { id: string }

async function executeQuery(database: unknown, query: SQL): Promise<TodoInsert[]> {
  const rawDb = database as {
    all?: (rawQuery: SQL) => Promise<TodoInsert[]>
    execute?: (rawQuery: SQL) => Promise<TodoInsert[]>
  }
  const execute = rawDb.all ?? rawDb.execute

  if (!execute) {
    throw new Error('Database does not support raw queries')
  }

  return execute.call(database, query)
}

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
  const [inserted] = maxItems !== null && process.env.POSTGRES_URL
    ? await db.transaction(async (transaction) => {
        // A separate lock statement gives READ COMMITTED a fresh snapshot before the quota check.
        await executeQuery(transaction, sql`select id from "user" where id = ${user.id} for update`)
        return executeQuery(transaction, query)
      })
    : await executeQuery(db, query)

  if (!inserted) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Free todo limit reached',
      data: { code: 'FREE_TODO_LIMIT_REACHED', maxItems }
    })
  }

  return { success: true as const }
})
