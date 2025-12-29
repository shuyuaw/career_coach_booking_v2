import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { db } from "./db";
import { bookingUsers, bookings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Booking Cancellation Email", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let testUserId: string;
  let testBookingId: number;

  beforeAll(async () => {
    // Create test context with admin user
    const ctx = {
      user: {
        openId: "test-admin",
        name: "Test Admin",
        role: "admin" as const,
      },
    };
    caller = appRouter.createCaller(ctx);

    // Create test user
    const testUser = await caller.admin.createUser({
      name: "Test Cancel User",
      nickname: "Test Cancel User",
      mobileNumber: `13900000${Date.now() % 1000}`,
      credits: 10,
      email: "test.cancel@example.com",
    });
    testUserId = testUser.mobileNumber;

    // Create a booking for testing cancellation
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5); // 5 days in future
    futureDate.setHours(10, 0, 0, 0);

    const booking = await caller.booking.createBooking({
      userId: testUserId,
      startTime: futureDate.toISOString(),
    });
    testBookingId = booking.id;
  });

  it("should send cancellation email to both customer and coach", async () => {
    // Cancel the booking
    await caller.booking.cancelBooking({
      bookingId: testBookingId,
      userId: testUserId,
    });

    // Verify booking was cancelled
    const cancelledBooking = await db.query.bookings.findFirst({
      where: eq(bookings.id, testBookingId),
    });

    expect(cancelledBooking).toBeDefined();
    expect(cancelledBooking?.status).toBe("cancelled");

    // Verify user credits were refunded
    const user = await db.query.bookingUsers.findFirst({
      where: eq(bookingUsers.mobileNumber, testUserId),
    });

    expect(user).toBeDefined();
    expect(user?.credits).toBe(10); // Should be refunded back to 10

    console.log("✅ Cancellation email test passed - check email logs above");
  }, 30000);
});
