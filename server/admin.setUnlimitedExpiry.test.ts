import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getBookingUserByMobile, createBookingUser } from "./bookingDb";

describe("Admin setUnlimitedExpiry", () => {
  let testUserMobile: string;

  beforeAll(async () => {
    // Create a test user
    testUserMobile = `exp-${Date.now()}`;
    await createBookingUser({
      mobileNumber: testUserMobile,
      accessSlug: `expiry-slug-${Date.now()}`,
      nickname: "Expiry Test User",
      email: "expiry@test.com",
      bulkCredits: 0,
      unlimitedExpiry: null,
    });
  });

  it("should set custom expiry date for unlimited subscription", async () => {
    const adminContext: TrpcContext = {
      req: {
        protocol: "https",
        headers: {},
      } as any,
      res: {} as any,
      user: {
        id: 1,
        openId: "test-admin",
        name: "Test Admin",
        email: "admin@test.com",
        role: "admin",
        loginMethod: "manus",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };
    const adminCaller = appRouter.createCaller(adminContext);

    // Set expiry to 2026-06-30
    const result = await adminCaller.admin.setUnlimitedExpiry({
      mobileNumber: testUserMobile,
      expiryDate: "2026-06-30",
    });

    expect(result.success).toBe(true);
    expect(result.expiry).toBeDefined();

    // Verify the expiry was set correctly
    const user = await getBookingUserByMobile(testUserMobile);
    expect(user).toBeTruthy();
    expect(user?.unlimitedExpiry).toBeDefined();

    // Check that the date is 2026-06-30 23:59:59 China time
    const expiryDate = new Date(user!.unlimitedExpiry!);
    const chinaDate = new Date(expiryDate.getTime() + 8 * 60 * 60 * 1000); // Add 8 hours for China timezone
    
    expect(chinaDate.getUTCFullYear()).toBe(2026);
    expect(chinaDate.getUTCMonth()).toBe(5); // June is month 5 (0-indexed)
    expect(chinaDate.getUTCDate()).toBe(30);
    expect(chinaDate.getUTCHours()).toBe(23);
    expect(chinaDate.getUTCMinutes()).toBe(59);
  });

  it("should reject setting expiry by non-admin user", async () => {
    const userContext: TrpcContext = {
      req: {
        protocol: "https",
        headers: {},
      } as any,
      res: {} as any,
      user: {
        id: 2,
        openId: "test-user",
        name: "Regular User",
        email: "user@test.com",
        role: "user",
        loginMethod: "manus",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };
    const userCaller = appRouter.createCaller(userContext);

    await expect(
      userCaller.admin.setUnlimitedExpiry({
        mobileNumber: testUserMobile,
        expiryDate: "2026-12-31",
      })
    ).rejects.toThrow("FORBIDDEN");
  });

  it("should return error when setting expiry for non-existent user", async () => {
    const adminContext: TrpcContext = {
      req: {
        protocol: "https",
        headers: {},
      } as any,
      res: {} as any,
      user: {
        id: 1,
        openId: "test-admin",
        name: "Test Admin",
        email: "admin@test.com",
        role: "admin",
        loginMethod: "manus",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };
    const adminCaller = appRouter.createCaller(adminContext);

    await expect(
      adminCaller.admin.setUnlimitedExpiry({
        mobileNumber: "non-existent-999",
        expiryDate: "2026-12-31",
      })
    ).rejects.toThrow("User not found");
  });
});
