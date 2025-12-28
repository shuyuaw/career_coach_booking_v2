import { describe, expect, it } from "vitest";
import { getFeishuConfig, fetchBusyBlocks } from "./feishu";

describe("Feishu Integration", () => {
  it("should have Feishu configuration available", () => {
    const config = getFeishuConfig();
    expect(config).not.toBeNull();
    expect(config?.appId).toBeTruthy();
    expect(config?.appSecret).toBeTruthy();
  });

  it("should successfully fetch busy blocks from Feishu Calendar", async () => {
    const config = getFeishuConfig();
    if (!config) {
      throw new Error("Feishu configuration not available");
    }

    // Test fetching busy blocks for the next 7 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    try {
      const busyBlocks = await fetchBusyBlocks(startDate, endDate);
      
      // Should return an array (may be empty if no events)
      expect(Array.isArray(busyBlocks)).toBe(true);
      
      // If there are busy blocks, validate structure
      if (busyBlocks.length > 0) {
        expect(busyBlocks[0]).toHaveProperty("startTime");
        expect(busyBlocks[0]).toHaveProperty("endTime");
        expect(typeof busyBlocks[0].startTime).toBe("number");
        expect(typeof busyBlocks[0].endTime).toBe("number");
      }
    } catch (error) {
      // If authentication fails, throw a clear error
      if (error instanceof Error && error.message.includes("authenticate")) {
        throw new Error("Feishu authentication failed. Please check your App ID and App Secret.");
      }
      throw error;
    }
  }, 15000); // Increase timeout for network request

  it("should have Tencent Meeting URL configured", () => {
    const tencentMeetingUrl = process.env.TENCENT_MEETING_URL;
    expect(tencentMeetingUrl).toBeTruthy();
    expect(tencentMeetingUrl).toMatch(/^https?:\/\//);
  });
});
