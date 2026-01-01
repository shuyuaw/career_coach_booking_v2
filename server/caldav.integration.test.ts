import { describe, it, expect } from 'vitest';
import { createBookingEvent, deleteBookingEvent, getBusySlots } from './caldav';

describe('CalDAV Integration with Named Calendar', () => {
  it('should create and delete booking event in the specified calendar', async () => {
    const calendarName = process.env.CALDAV_CALENDAR_NAME;
    console.log(`\n[Test] Using calendar: "${calendarName}"`);

    // Create a test booking event 2 hours from now
    const now = Date.now();
    const startTime = now + 2 * 60 * 60 * 1000; // 2 hours from now
    const endTime = startTime + 60 * 60 * 1000; // 1 hour duration

    const userName = 'Test User (Calendar Name Test)';
    const meetingUrl = 'https://meeting.tencent.com/p/5146842585';

    console.log('[Test] Creating booking event...');
    const eventUid = await createBookingEvent(startTime, endTime, userName, meetingUrl);

    expect(eventUid).toBeDefined();
    expect(typeof eventUid).toBe('string');
    console.log(`[Test] ✅ Created event with UID: ${eventUid}`);

    // Wait a moment for the event to sync
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Verify the event appears in busy slots
    console.log('[Test] Fetching busy slots to verify event...');
    const busySlots = await getBusySlots(startTime - 1000, endTime + 1000);

    console.log(`[Test] Found ${busySlots.length} busy slot(s) in range`);
    busySlots.forEach((slot, idx) => {
      console.log(`[Test]   Slot ${idx + 1}: ${new Date(slot.start).toISOString()} - ${new Date(slot.end).toISOString()} (${slot.summary || 'no summary'})`);
    });

    // Use looser matching: within 5 minutes of expected time
    const foundSlot = busySlots.find(
      (slot) => Math.abs(slot.start - startTime) < 5 * 60 * 1000 && Math.abs(slot.end - endTime) < 5 * 60 * 1000
    );

    expect(foundSlot).toBeDefined();
    console.log(`[Test] ✅ Found event in busy slots: ${foundSlot?.summary}`);

    // Clean up: delete the event
    console.log('[Test] Deleting event...');
    await deleteBookingEvent(eventUid);
    console.log('[Test] ✅ Event deleted successfully');
  }, 60000);
});
