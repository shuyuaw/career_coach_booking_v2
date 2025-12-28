import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { bookingUsers, bookings, InsertBookingUser, InsertBooking } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Get booking user by access slug
 */
export async function getBookingUserBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(bookingUsers)
    .where(eq(bookingUsers.accessSlug, slug))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get booking user by mobile number
 */
export async function getBookingUserByMobile(mobileNumber: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(bookingUsers)
    .where(eq(bookingUsers.mobileNumber, mobileNumber))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create a new booking user
 */
export async function createBookingUser(user: InsertBookingUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(bookingUsers).values(user);
}

/**
 * Update booking user credits
 */
export async function updateBookingUserCredits(
  mobileNumber: string,
  bulkCredits: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(bookingUsers)
    .set({ bulkCredits })
    .where(eq(bookingUsers.mobileNumber, mobileNumber));
}

/**
 * Update booking user unlimited expiry
 */
export async function updateBookingUserUnlimited(
  mobileNumber: string,
  unlimitedExpiry: number | null
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(bookingUsers)
    .set({ unlimitedExpiry })
    .where(eq(bookingUsers.mobileNumber, mobileNumber));
}

/**
 * Get all booking users sorted by most recent booking
 */
export async function getAllBookingUsers() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(bookingUsers)
    .orderBy(desc(bookingUsers.updatedAt));

  return result;
}

/**
 * Create a new booking
 */
export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(bookings).values(booking);
}

/**
 * Get user's active bookings
 */
export async function getUserActiveBookings(userId: string) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.userId, userId),
        eq(bookings.status, "active")
      )
    )
    .orderBy(asc(bookings.startTime));

  return result;
}

/**
 * Get user's active bookings within a specific week
 */
export async function getUserWeeklyBookings(
  userId: string,
  weekStart: number,
  weekEnd: number
) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.userId, userId),
        eq(bookings.status, "active"),
        gte(bookings.startTime, weekStart),
        lte(bookings.startTime, weekEnd)
      )
    );

  return result;
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(bookings)
    .set({ status: "cancelled" })
    .where(eq(bookings.id, bookingId));
}

/**
 * Get booking by ID
 */
export async function getBookingById(bookingId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all bookings for a user (including cancelled)
 */
export async function getAllUserBookings(userId: string) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.startTime));

  return result;
}
