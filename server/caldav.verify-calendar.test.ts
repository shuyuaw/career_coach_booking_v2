import { describe, it, expect } from 'vitest';
import { createBookingEvent } from './caldav';
import { createDAVClient } from 'tsdav';

describe('Verify Calendar Selection', () => {
  it('should create event in the specified calendar and confirm location', async () => {
    const calendarName = process.env.CALDAV_CALENDAR_NAME;
    console.log(`\n[Verify] Target calendar name: "${calendarName}"`);

    // Create a test booking event 3 hours from now
    const now = Date.now();
    const startTime = now + 3 * 60 * 60 * 1000; // 3 hours from now
    const endTime = startTime + 60 * 60 * 1000; // 1 hour duration

    const userName = 'Calendar Verification Test';
    const meetingUrl = 'https://meeting.tencent.com/p/5146842585';

    console.log('[Verify] Creating booking event...');
    const eventUid = await createBookingEvent(startTime, endTime, userName, meetingUrl);

    expect(eventUid).toBeDefined();
    console.log(`[Verify] ✅ Created event with UID: ${eventUid}`);

    // Wait for sync
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Connect to CalDAV and find which calendar contains the event
    const caldavUrl = process.env.CALDAV_URL!;
    const caldavUsername = process.env.CALDAV_USERNAME!;
    const caldavPassword = process.env.CALDAV_PASSWORD!;

    const client = await createDAVClient({
      serverUrl: caldavUrl,
      credentials: {
        username: caldavUsername,
        password: caldavPassword,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    });

    const calendars = await client.fetchCalendars();
    console.log(`\n[Verify] Searching for event across ${calendars.length} calendars...`);

    let foundInCalendar: string | null = null;

    for (const calendar of calendars) {
      const objects = await client.fetchCalendarObjects({
        calendar: calendar,
      });

      for (const obj of objects) {
        if (obj.data && obj.data.includes(`UID:${eventUid}`)) {
          foundInCalendar = calendar.displayName || calendar.description || 'Unknown';
          console.log(`\n[Verify] 🎯 Event found in calendar: "${foundInCalendar}"`);
          console.log(`[Verify] Calendar URL: ${calendar.url}`);
          console.log(`[Verify] Calendar Color: ${calendar.calendarColor || 'N/A'}`);
          break;
        }
      }

      if (foundInCalendar) break;
    }

    expect(foundInCalendar).toBeDefined();
    expect(foundInCalendar).toBe(calendarName);

    if (foundInCalendar === calendarName) {
      console.log(`\n[Verify] ✅ SUCCESS: Event was created in the correct calendar: "${calendarName}"`);
    } else {
      console.log(`\n[Verify] ❌ FAILURE: Event was created in "${foundInCalendar}" instead of "${calendarName}"`);
    }

    console.log(`\n[Verify] Please check your iCloud calendar to confirm the event appears in "${calendarName}"`);
    console.log(`[Verify] Event details: ${userName} at ${new Date(startTime).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
    console.log(`\n[Verify] NOTE: This test does NOT delete the event. Please manually delete it from your calendar after verification.`);
  }, 60000);
});
