import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getBookingUserByMobile, createBookingUser, createBooking } from "./bookingDb";

describe("Admin deleteUser", () => {
  let testUserMobile: string;

  beforeAll(async () => {

    // Create a test user for deletion
    testUserMobile = `del-${Date.now()}`;
    await createBookingUser({
      mobileNumber: testUserMobile,
      accessSlug: `test-delete-slug-${Date.now()}`,
      nickname: "Test Delete User",
      email: "delete@test.com",
      bulkCredits: 5,
      unlimitedExpiry: null,
    });
  });

  it("should delete user and all their bookings", async () => {
    // Verify user exists before deletion
    const userBefore = await getBookingUserByMobile(testUserMobile);
    expect(userBefore).toBeTruthy();
    expect(userBefore?.nickname).toBe("Test Delete User");

    // Create admin context and caller
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

    // Delete the user
    const result = await adminCaller.admin.deleteUser({
      mobileNumber: testUserMobile,
    });

    expect(result.success).toBe(true);

    // Verify user is deleted
    const userAfter = await getBookingUserByMobile(testUserMobile);
    expect(userAfter).toBeNull();
  });

  it("should return error when deleting non-existent user", async () => {
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
      adminCaller.admin.deleteUser({
        mobileNumber: "non-existent-user-999",
      })
    ).rejects.toThrow("User not found");
  });

  it("should reject deletion by non-admin user", async () => {
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
      userCaller.admin.deleteUser({
        mobileNumber: "any-user",
      })
    ).rejects.toThrow("FORBIDDEN");
  });
});
