import { describe, it, expect } from 'vitest';
import { createDAVClient } from 'tsdav';

describe('CalDAV Calendar Name Configuration', () => {
  it('should find and validate the specified calendar name', async () => {
    const caldavUrl = process.env.CALDAV_URL;
    const caldavUsername = process.env.CALDAV_USERNAME;
    const caldavPassword = process.env.CALDAV_PASSWORD;
    const calendarName = process.env.CALDAV_CALENDAR_NAME;

    expect(caldavUrl).toBeDefined();
    expect(caldavUsername).toBeDefined();
    expect(caldavPassword).toBeDefined();
    expect(calendarName).toBeDefined();

    console.log(`\n[Test] Validating calendar name: "${calendarName}"`);

    // Create CalDAV client
    const client = await createDAVClient({
      serverUrl: caldavUrl!,
      credentials: {
        username: caldavUsername!,
        password: caldavPassword!,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    });

    // Fetch all calendars
    const calendars = await client.fetchCalendars();
    expect(calendars).toBeDefined();
    expect(calendars.length).toBeGreaterThan(0);

    console.log(`[Test] Found ${calendars.length} calendar(s)`);

    // Find the specified calendar
    const targetCalendar = calendars.find(
      (cal) => cal.displayName === calendarName || cal.description === calendarName
    );

    expect(targetCalendar).toBeDefined();
    console.log(`[Test] ✅ Found calendar: "${targetCalendar!.displayName}"`);
    console.log(`[Test] Calendar URL: ${targetCalendar!.url}`);
    console.log(`[Test] Calendar Color: ${targetCalendar!.calendarColor || 'N/A'}`);
  }, 30000);
});
