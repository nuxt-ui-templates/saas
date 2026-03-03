import { sql } from 'drizzle-orm'
import { user } from 'hub:db:schema'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const todoItem = sqliteTable('todo_item', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
}, table => [index('todo_item_userId_idx').on(table.userId)])
