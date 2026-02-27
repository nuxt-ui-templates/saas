import { user } from 'hub:db:schema'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const todoItem = sqliteTable('todo_item', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull()
}, table => [index('todo_item_userId_idx').on(table.userId)])
