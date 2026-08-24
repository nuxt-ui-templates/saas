import { user } from '#auth/schema'
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const todoItem = pgTable('todo_item', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, table => [index('todo_item_userId_idx').on(table.userId)])
