import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const todoId = getRouterParam(event, 'id')

  if (!todoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Todo id is required'
    })
  }

  const [deleted] = await db
    .delete(schema.todoItem)
    .where(and(
      eq(schema.todoItem.id, todoId),
      eq(schema.todoItem.userId, user.id)
    ))
    .returning({ id: schema.todoItem.id })

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found'
    })
  }

  return {
    success: true
  }
})
