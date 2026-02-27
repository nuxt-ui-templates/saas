import { sql } from 'drizzle-orm'
import { FREE_TODO_LIMIT, resolveTodoPlan } from '../../utils/todo-plan'
import { toTodoItemResponse } from '../../utils/todo-items'

interface CreateTodoBody {
  title: string
}

function parseCreateTodoBody(body: unknown): CreateTodoBody {
  if (!body || typeof body !== 'object' || !('title' in body)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid todo payload'
    })
  }

  const title = String((body as { title: unknown }).title || '').trim()

  if (!title || title.length > 140) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todo title must be between 1 and 140 characters'
    })
  }

  return { title }
}

function createFreeTodoLimitError() {
  return createError({
    statusCode: 403,
    statusMessage: 'Free todo limit reached',
    data: {
      code: 'FREE_TODO_LIMIT_REACHED',
      maxItems: FREE_TODO_LIMIT
    }
  })
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const payload = parseCreateTodoBody(await readBody(event))
  const limits = await resolveTodoPlan(event)

  const values = {
    id: crypto.randomUUID(),
    userId: user.id,
    title: payload.title,
    completed: false
  }

  const todo = limits.plan === 'free'
    ? (await db.all<typeof schema.todoItem.$inferSelect>(sql`
        insert into todo_item ("id", "userId", "title", "completed")
        select ${values.id}, ${values.userId}, ${values.title}, ${values.completed}
        where (
          select count(*)
          from todo_item
          where "userId" = ${user.id}
        ) < ${FREE_TODO_LIMIT}
        returning "id", "userId", "title", "completed", "createdAt", "updatedAt"
      `))[0]
    : (await db.insert(schema.todoItem).values(values).returning())[0]

  if (!todo) {
    throw createFreeTodoLimitError()
  }

  return {
    item: toTodoItemResponse(todo)
  }
})
