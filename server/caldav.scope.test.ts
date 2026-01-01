import { describe, it, expect } from 'vitest';
import { getBusySlots } from './caldav';
import { createDAVClient } from 'tsdav';

describe('CalDAV Calendar Scope Verification', () => {
  it('should only read busy slots from the specified calendar, not all calendars', async () => {
    const calendarName = process.env.CALDAV_CALENDAR_NAME;
    console.log(`\n[Scope Test] Target calendar: "${calendarName}"`);

    // Get busy slots using our function (should only read from specified calendar)
    const now = Date.now();
    const startTime = now - 7 * 24 * 60 * 60 * 1000; // 7 days ago
    const endTime = now + 7 * 24 * 60 * 60 * 1000; // 7 days from now

    console.log('[Scope Test] Fetching busy slots from specified calendar...');
    const busySlotsFromSpecified = await getBusySlots(startTime, endTime);
    console.log(`[Scope Test] Found ${busySlotsFromSpecified.length} event(s) in specified calendar`);

    // Now fetch from ALL calendars to compare
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
    console.log(`\n[Scope Test] Total calendars in account: ${calendars.length}`);

    let totalEventsAcrossAllCalendars = 0;
    const eventsByCalendar: Record<string, number> = {};

    for (const calendar of calendars) {
      const objects = await client.fetchCalendarObjects({
        calendar: calendar,
        timeRange: {
          start: new Date(startTime).toISOString(),
          end: new Date(endTime).toISOString(),
        },
      });

      const eventCount = objects.filter((obj) => obj.data).length;
      eventsByCalendar[calendar.displayName || 'Unknown'] = eventCount;
      totalEventsAcrossAllCalendars += eventCount;
    }

    console.log('\n[Scope Test] Events by calendar:');
    Object.entries(eventsByCalendar).forEach(([name, count]) => {
      const marker = name === calendarName ? ' ← SPECIFIED' : '';
      console.log(`  - ${name}: ${count} event(s)${marker}`);
    });

    console.log(`\n[Scope Test] Total events across all calendars: ${totalEventsAcrossAllCalendars}`);
    console.log(`[Scope Test] Events from specified calendar only: ${busySlotsFromSpecified.length}`);

    // Verify that we're only reading from the specified calendar
    expect(busySlotsFromSpecified.length).toBe(eventsByCalendar[calendarName!] || 0);

    if (totalEventsAcrossAllCalendars > busySlotsFromSpecified.length) {
      console.log(
        `\n[Scope Test] ✅ SUCCESS: System correctly ignores ${totalEventsAcrossAllCalendars - busySlotsFromSpecified.length} event(s) from other calendars`
      );
    } else {
      console.log('\n[Scope Test] ✅ SUCCESS: Only specified calendar has events');
    }
  }, 60000);
});
