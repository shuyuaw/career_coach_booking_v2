import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { createBookingUser, getBookingUserBySlug } from "./bookingDb";
import { nanoid } from "nanoid";

// Create a mock admin context
function createAdminContext(): TrpcContext {
  const adminUser = {
    id: 1,
    openId: "admin-test",
    email: "admin@test.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: adminUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// Create a mock public context
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Complete Booking Flow Integration Test", () => {
  let testUserSlug: string;
  const testMobileNumber = `test-${Date.now()}`;
  const testNickname = "测试用户";

  beforeAll(async () => {
    // Create a test user directly in the database
    testUserSlug = `${testNickname.toLowerCase()}-${nanoid(6)}`;
    await createBookingUser({
      mobileNumber: testMobileNumber,
      accessSlug: testUserSlug,
      nickname: testNickname,
      bulkCredits: 5,
      unlimitedExpiry: null,
    });
  });

  it("should retrieve user by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.getUserBySlug({ slug: testUserSlug });

    expect(result).toBeDefined();
    expect(result.nickname).toBe(testNickname);
    expect(result.bulkCredits).toBe(5);
    expect(result.accessSlug).toBe(testUserSlug);
  });

  it("should fetch available time slots", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const startDate = Date.now();
    const endDate = startDate + 7 * 24 * 60 * 60 * 1000; // 7 days from now

    const result = await caller.booking.getAvailableSlots({
      startDate,
      endDate,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.slots)).toBe(true);
    // Should have some slots (depends on calendar availability)
    console.log(`Found ${result.slots.length} available slots`);
  });

  it("should create a booking with bulk credits", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Get a slot 48 hours from now (to satisfy 24-hour rule)
    const startTime = Date.now() + 48 * 60 * 60 * 1000;

    const result = await caller.booking.createBooking({
      userId: testMobileNumber,
      startTime,
    });

    expect(result.success).toBe(true);
    expect(result.bookingId).toBeDefined();
    expect(result.meetingUrl).toBeDefined();

    // Verify user credits were deducted
    const user = await getBookingUserBySlug(testUserSlug);
    expect(user?.bulkCredits).toBe(4); // 5 - 1 = 4
  });

  it("should list user bookings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.booking.getUserBookings({
      userId: testMobileNumber,
    });

    expect(result.bookings).toBeDefined();
    expect(Array.isArray(result.bookings)).toBe(true);
    expect(result.bookings.length).toBeGreaterThan(0);
  });

  it("admin should be able to add credits", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.addCredits({
      mobileNumber: testMobileNumber,
      amount: 5,
    });

    expect(result.success).toBe(true);

    // Verify credits were added
    const user = await getBookingUserBySlug(testUserSlug);
    expect(user?.bulkCredits).toBe(9); // 4 + 5 = 9
  });

  it("admin should be able to activate unlimited subscription", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.activateUnlimited({
      mobileNumber: testMobileNumber,
    });

    expect(result.success).toBe(true);
    expect(result.expiry).toBeDefined();

    // Verify unlimited was activated
    const user = await getBookingUserBySlug(testUserSlug);
    expect(user?.unlimitedExpiry).not.toBeNull();
    expect(user!.unlimitedExpiry! > Date.now()).toBe(true);
  });

  it("should enforce 24-hour booking rule", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Try to book within 24 hours
    const startTime = Date.now() + 12 * 60 * 60 * 1000; // 12 hours from now

    await expect(
      caller.booking.createBooking({
        userId: testMobileNumber,
        startTime,
      })
    ).rejects.toThrow("Cannot book within 24 hours");
  });
});
