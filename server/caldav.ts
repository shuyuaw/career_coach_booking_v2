import { createDAVClient, DAVCalendar, DAVCalendarObject } from 'tsdav';

/**
 * CalDAV service for Apple Calendar integration.
 * Reads busy slots and writes booking events to iCloud calendar.
 */

let client: Awaited<ReturnType<typeof createDAVClient>> | null = null;

async function getClient() {
  if (!client) {
    const caldavUrl = process.env.CALDAV_URL;
    const caldavUsername = process.env.CALDAV_USERNAME;
    const caldavPassword = process.env.CALDAV_PASSWORD;

    if (!caldavUrl || !caldavUsername || !caldavPassword) {
      throw new Error('CalDAV credentials not configured');
    }

    client = await createDAVClient({
      serverUrl: caldavUrl,
      credentials: {
        username: caldavUsername,
        password: caldavPassword,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    });
  }

  return client;
}

interface BusySlot {
  start: number; // Unix timestamp in milliseconds
  end: number; // Unix timestamp in milliseconds
  summary?: string;
}

/**
 * Fetch busy time slots from Apple Calendar within a date range.
 * @param startDate Start of the range (Unix timestamp in milliseconds)
 * @param endDate End of the range (Unix timestamp in milliseconds)
 * @returns Array of busy time slots
 */
export async function getBusySlots(startDate: number, endDate: number): Promise<BusySlot[]> {
  try {
    const davClient = await getClient();

    // Fetch calendars
    const calendars = await davClient.fetchCalendars();

    if (!calendars || calendars.length === 0) {
      console.warn('[CalDAV] No calendars found');
      return [];
    }

    // Find the specified calendar
    const calendarName = process.env.CALDAV_CALENDAR_NAME;
    const calendar = findCalendar(calendars, calendarName);

    console.log(`[CalDAV] Reading busy slots from calendar: ${calendar.displayName}`);
    console.log(`[CalDAV] Date range: ${new Date(startDate).toISOString()} to ${new Date(endDate).toISOString()}`);

    const busySlots: BusySlot[] = [];

    // Query only the specified calendar for events in the date range
    const objects = await davClient.fetchCalendarObjects({
      calendar: calendar,
      timeRange: {
        start: new Date(startDate).toISOString(),
        end: new Date(endDate).toISOString(),
      },
    });

    console.log(`[CalDAV] Fetched ${objects.length} calendar objects from CalDAV`);
    
    // Parse each calendar object
    for (const obj of objects) {
      if (!obj.data) continue;

      // Parse iCalendar data
      const lines = obj.data.split('\n');
      let inEvent = false;
      let dtStart: string | null = null;
      let dtEnd: string | null = null;
      let summary: string | null = null;

      for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === 'BEGIN:VEVENT') {
          inEvent = true;
          dtStart = null;
          dtEnd = null;
          summary = null;
        } else if (trimmed === 'END:VEVENT' && inEvent) {
          if (dtStart && dtEnd) {
            const startTime = parseICalDate(dtStart);
            const endTime = parseICalDate(dtEnd);
            console.log(`[CalDAV] Parsed event: "${summary || 'No title'}" | Start: ${new Date(startTime).toISOString()} | End: ${new Date(endTime).toISOString()}`);
            busySlots.push({
              start: startTime,
              end: endTime,
              summary: summary || undefined,
            });
          } else {
            console.log(`[CalDAV] Skipped event (missing dates): "${summary || 'No title'}" | dtStart=${dtStart} | dtEnd=${dtEnd}`);
          }

          inEvent = false;
        } else if (inEvent) {
          if (trimmed.startsWith('DTSTART')) {
            const parts = trimmed.split(':');
            dtStart = parts.slice(1).join(':') || null;
          } else if (trimmed.startsWith('DTEND')) {
            const parts = trimmed.split(':');
            dtEnd = parts.slice(1).join(':') || null;
          } else if (trimmed.startsWith('SUMMARY:')) {
            summary = trimmed.substring(8);
          }
        }
      }
    }

    return busySlots;
  } catch (error) {
    console.error('[CalDAV] Error fetching busy slots:', error);
    throw new Error('Failed to fetch calendar availability');
  }
}

/**
 * Parse iCalendar date string to Unix timestamp.
 * Supports formats:
 * - YYYYMMDDTHHMMSSZ (UTC time, ends with Z)
 * - YYYYMMDDTHHMMSS (local time, no Z - assumes China timezone UTC+8)
 */
function parseICalDate(dateStr: string): number {
  try {
    const isUTC = dateStr.endsWith('Z');
    const cleaned = dateStr.replace(/[TZ]/g, '');

    const year = parseInt(cleaned.substring(0, 4));
    const month = parseInt(cleaned.substring(4, 6)) - 1; // Month is 0-indexed
    const day = parseInt(cleaned.substring(6, 8));
    const hour = parseInt(cleaned.substring(8, 10)) || 0;
    const minute = parseInt(cleaned.substring(10, 12)) || 0;
    const second = parseInt(cleaned.substring(12, 14)) || 0;

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      console.error(`[CalDAV] Invalid date components in: "${dateStr}" -> year=${year}, month=${month}, day=${day}`);
      throw new Error(`Invalid date format: ${dateStr}`);
    }

    if (isUTC) {
      // UTC time (ends with Z) - use as is
      return new Date(Date.UTC(year, month, day, hour, minute, second)).getTime();
    } else {
      // Local time (no Z) - assume China timezone (UTC+8)
      // The time is in local timezone, so we need to subtract 8 hours to get UTC
      const localTimestamp = new Date(Date.UTC(year, month, day, hour, minute, second)).getTime();
      // Since the time represents UTC+8, subtract 8 hours to get actual UTC
      return localTimestamp - 8 * 60 * 60 * 1000;
    }
  } catch (error) {
    console.error(`[CalDAV] Error parsing date "${dateStr}":`, error);
    throw error;
  }
}

/**
 * Format date to iCalendar format (YYYYMMDDTHHMMSSZ)
 */
function formatICalDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hour}${minute}${second}Z`;
}

/**
 * Generate a unique UID for calendar events
 */
function generateUID(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@coaching`;
}

/**
 * Find calendar by name from the list of available calendars.
 * Falls back to first calendar if name not specified or not found.
 */
function findCalendar(calendars: DAVCalendar[], calendarName?: string): DAVCalendar {
  if (!calendarName) {
    console.log('[CalDAV] No calendar name specified, using first calendar');
    return calendars[0];
  }

  const found = calendars.find(
    (cal) => cal.displayName === calendarName || cal.description === calendarName
  );

  if (found) {
    console.log(`[CalDAV] Found calendar: ${found.displayName}`);
    return found;
  }

  console.warn(`[CalDAV] Calendar "${calendarName}" not found, using first calendar`);
  return calendars[0];
}

/**
 * Create a booking event in Apple Calendar.
 * @param startTime Session start time (Unix timestamp in milliseconds)
 * @param endTime Session end time (Unix timestamp in milliseconds)
 * @param userName User's name or nickname
 * @param meetingUrl Tencent Meeting URL
 * @returns The UID of the created calendar event
 */
export async function createBookingEvent(
  startTime: number,
  endTime: number,
  userName: string,
  meetingUrl: string
): Promise<string> {
  try {
    const davClient = await getClient();

    // Fetch calendars
    const calendars = await davClient.fetchCalendars();

    if (!calendars || calendars.length === 0) {
      throw new Error('No calendars found');
    }

    // Find calendar by name from environment variable
    const calendarName = process.env.CALDAV_CALENDAR_NAME;
    const calendar = findCalendar(calendars, calendarName);

    const uid = generateUID();
    const now = formatICalDate(Date.now());
    const dtStart = formatICalDate(startTime);
    const dtEnd = formatICalDate(endTime);

    // Create iCalendar event
    const icalData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Career Coaching//Booking System//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:[约谈] ${userName}`,
      `LOCATION:${meetingUrl}`,
      `DESCRIPTION:职业教练约谈 - ${userName}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    // Create calendar object
    await davClient.createCalendarObject({
      calendar: calendar,
      filename: `${uid}.ics`,
      iCalString: icalData,
    });

    console.log(`[CalDAV] Created booking event for ${userName} at ${new Date(startTime).toISOString()}`);
    return uid;
  } catch (error) {
    console.error('[CalDAV] Error creating booking event:', error);
    throw new Error('Failed to create calendar event');
  }
}

/**
 * Delete a booking event from Apple Calendar.
 * @param eventUid The UID of the calendar event to delete
 */
export async function deleteBookingEvent(eventUid: string): Promise<void> {
  try {
    const davClient = await getClient();

    // Fetch calendars
    const calendars = await davClient.fetchCalendars();

    if (!calendars || calendars.length === 0) {
      throw new Error('No calendars found');
    }

    // Find the specified calendar
    const calendarName = process.env.CALDAV_CALENDAR_NAME;
    const calendar = findCalendar(calendars, calendarName);

    console.log(`[CalDAV] Searching for event in calendar: ${calendar.displayName}`);

    // Search for the event in the specified calendar only
    const objects = await davClient.fetchCalendarObjects({
      calendar: calendar,
    });

    for (const obj of objects) {
      if (!obj.data || !obj.url) continue;

      // Check if this object contains the event with matching UID
      if (obj.data.includes(`UID:${eventUid}`)) {
        // Delete the calendar object
        await davClient.deleteCalendarObject({
          calendarObject: obj,
        });

        console.log(`[CalDAV] Deleted booking event with UID: ${eventUid}`);
        return;
      }
    }

    console.warn(`[CalDAV] Event with UID ${eventUid} not found in calendar "${calendar.displayName}"`);
  } catch (error) {
    console.error('[CalDAV] Error deleting booking event:', error);
    throw new Error('Failed to delete calendar event');
  }
}
