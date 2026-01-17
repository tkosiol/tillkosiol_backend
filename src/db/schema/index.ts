import { pgTable, serial, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// ============== Contact Messages ==============

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  
  // Absender-Informationen
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }),
  
  // Nachricht
  message: text('message').notNull(),
  
  // Status
  isRead: boolean('is_read').default(false).notNull(),
  isArchived: boolean('is_archived').default(false).notNull(),
  
  // Metadata
  ipAddress: varchar('ip_address', { length: 45 }), // IPv6 can be up to 45 chars
  userAgent: text('user_agent'),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
});

// ============== Type Exports ==============

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
