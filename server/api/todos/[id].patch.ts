import { and, eq } from 'drizzle-orm'
import { toTodoItemResponse } from '../../utils/todo-items'

interface UpdateTodoBody {
  completed: boolean
}

function parseUpdateTodoBody(body: unknown): UpdateTodoBody {
  if (!body || typeof body !== 'object' || !('completed' in body)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid todo payload'
    })
  }

  if (typeof (body as { completed: unknown }).completed !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todo completed must be a boolean'
    })
  }

  return { completed: (body as { completed: boolean }).completed }
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const todoId = getRouterParam(event, 'id')

  if (!todoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todo id is required'
    })
  }

  const payload = parseUpdateTodoBody(await readBody(event))

  const [todo] = await db
    .update(schema.todoItem)
    .set({
      completed: payload.completed,
      updatedAt: new Date()
    })
    .where(and(
      eq(schema.todoItem.id, todoId),
      eq(schema.todoItem.userId, user.id)
    ))
    .returning()

  if (!todo) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found'
    })
  }

  return {
    item: toTodoItemResponse(todo)
  }
})
