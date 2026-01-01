import { describe, it, expect } from 'vitest';
import { getBusySlots, createBookingEvent } from './caldav';

describe('CalDAV Apple Calendar Integration', () => {
  it('should successfully connect to Apple Calendar and fetch calendars', async () => {
    // Test that we can connect and fetch busy slots for today
    const now = Date.now();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const busySlots = await getBusySlots(startOfDay.getTime(), endOfDay.getTime());
      
      // Should return an array (even if empty)
      expect(Array.isArray(busySlots)).toBe(true);
      
      // Each slot should have start and end timestamps
      busySlots.forEach(slot => {
        expect(typeof slot.start).toBe('number');
        expect(typeof slot.end).toBe('number');
        expect(slot.start).toBeLessThan(slot.end);
      });

      console.log(`[CalDAV Test] Successfully fetched ${busySlots.length} busy slots for today`);
    } catch (error) {
      console.error('[CalDAV Test] Failed to connect:', error);
      throw error;
    }
  }, 30000); // 30 second timeout for network operations
});
