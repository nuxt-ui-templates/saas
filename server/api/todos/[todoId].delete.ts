import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const userId = (await getUserSession(event))!.user.id
  const todoId = getRouterParam(event, 'todoId')

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
      eq(schema.todoItem.userId, userId)
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
