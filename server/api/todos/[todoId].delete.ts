import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const deleteTodoParamsSchema = z.object({
  todoId: z.string().uuid('Invalid todo id')
})

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event)
  const { todoId } = await getValidatedRouterParams(event, deleteTodoParamsSchema.parse)

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
