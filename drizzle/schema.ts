import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with booking system fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Booking system users table
 * Users access via unique URL slug, no login required
 */
export const bookingUsers = mysqlTable("booking_users", {
  mobileNumber: varchar("mobile_number", { length: 20 }).primaryKey(),
  accessSlug: varchar("access_slug", { length: 100 }).notNull().unique(),
  nickname: varchar("nickname", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  bulkCredits: int("bulk_credits").default(0).notNull(),
  unlimitedExpiry: bigint("unlimited_expiry", { mode: "number" }), // UTC timestamp in milliseconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BookingUser = typeof bookingUsers.$inferSelect;
export type InsertBookingUser = typeof bookingUsers.$inferInsert;

/**
 * Bookings table
 * Stores all coaching session bookings
 */
export const bookings = mysqlTable("bookings", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID
  userId: varchar("user_id", { length: 20 }).notNull(), // FK to booking_users.mobile_number
  startTime: bigint("start_time", { mode: "number" }).notNull(), // UTC timestamp in milliseconds
  endTime: bigint("end_time", { mode: "number" }).notNull(), // UTC timestamp in milliseconds (start_time + 60 minutes)
  status: mysqlEnum("status", ["active", "cancelled"]).default("active").notNull(),
  creditTypeUsed: mysqlEnum("credit_type_used", ["bulk", "unlimited"]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
