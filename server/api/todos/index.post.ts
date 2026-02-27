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
  const limits = await resolveTodoPlan(event)
  const todoSelection = {
    id: schema.todoItem.id,
    title: schema.todoItem.title,
    completed: schema.todoItem.completed,
    createdAt: schema.todoItem.createdAt,
    updatedAt: schema.todoItem.updatedAt
  }

  const values = {
    id: crypto.randomUUID(),
    userId,
    title: payload.title,
    completed: false
  }

  if (limits.plan === 'free') {
    const [todo] = await db.all<{
      id: string
      title: string
      completed: boolean
      createdAt: Date | number
      updatedAt: Date | number
    }>(sql`
        insert into todo_item ("id", "userId", "title", "completed")
        select ${values.id}, ${values.userId}, ${values.title}, ${values.completed}
        where (
          select count(*)
          from todo_item
          where "userId" = ${userId}
        ) < ${FREE_TODO_LIMIT}
        returning "id", "title", "completed", "createdAt", "updatedAt"
      `)

    if (!todo) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Free todo limit reached',
        data: {
          code: 'FREE_TODO_LIMIT_REACHED',
          maxItems: FREE_TODO_LIMIT
        }
      })
    }

    return {
      item: todo
    }
  }

  const [todo] = await db.insert(schema.todoItem).values(values).returning(todoSelection)

  if (!todo) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create todo'
    })
  }

  return {
    item: todo
  }
})
