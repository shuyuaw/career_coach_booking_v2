import { describe, it, expect } from "vitest";
import { sendBookingConfirmation } from "./email";

describe("Email Service", () => {
  it("should send booking confirmation email successfully", async () => {
    const testData = {
      userEmail: "test@example.com", // This won't actually send, just validates SMTP connection
      userName: "测试用户",
      startTime: new Date("2025-12-30T02:00:00.000Z"), // 10:00 AM China time
      endTime: new Date("2025-12-30T03:00:00.000Z"), // 11:00 AM China time
    };

    // This will validate SMTP credentials are configured correctly
    // If credentials are invalid, it will throw an error
    await expect(
      sendBookingConfirmation(testData)
    ).resolves.not.toThrow();
  }, 30000); // 30 second timeout for email sending
});
