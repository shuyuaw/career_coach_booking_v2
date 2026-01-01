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

    const busySlots: BusySlot[] = [];

    // Query each calendar for events in the date range
    for (const calendar of calendars) {
      const objects = await davClient.fetchCalendarObjects({
        calendar: calendar,
        timeRange: {
          start: new Date(startDate).toISOString(),
          end: new Date(endDate).toISOString(),
        },
      });

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
              busySlots.push({
                start: parseICalDate(dtStart),
                end: parseICalDate(dtEnd),
                summary: summary || undefined,
              });
            }

            inEvent = false;
          } else if (inEvent) {
            if (trimmed.startsWith('DTSTART')) {
              dtStart = trimmed.split(':')[1] || null;
            } else if (trimmed.startsWith('DTEND')) {
              dtEnd = trimmed.split(':')[1] || null;
            } else if (trimmed.startsWith('SUMMARY:')) {
              summary = trimmed.substring(8);
            }
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
 * Supports formats: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
 */
function parseICalDate(dateStr: string): number {
  // Remove timezone indicator if present
  const cleaned = dateStr.replace(/[TZ]/g, '');

  const year = parseInt(cleaned.substring(0, 4));
  const month = parseInt(cleaned.substring(4, 6)) - 1; // Month is 0-indexed
  const day = parseInt(cleaned.substring(6, 8));
  const hour = parseInt(cleaned.substring(8, 10));
  const minute = parseInt(cleaned.substring(10, 12));
  const second = parseInt(cleaned.substring(12, 14));

  return new Date(Date.UTC(year, month, day, hour, minute, second)).getTime();
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
 * Create a booking event in Apple Calendar.
 * @param startTime Session start time (Unix timestamp in milliseconds)
 * @param endTime Session end time (Unix timestamp in milliseconds)
 * @param userName User's name or nickname
 * @param meetingUrl Tencent Meeting URL
 */
export async function createBookingEvent(
  startTime: number,
  endTime: number,
  userName: string,
  meetingUrl: string
): Promise<void> {
  try {
    const davClient = await getClient();

    // Fetch calendars
    const calendars = await davClient.fetchCalendars();

    if (!calendars || calendars.length === 0) {
      throw new Error('No calendars found');
    }

    // Use the first calendar (primary calendar)
    const calendar = calendars[0];

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
  } catch (error) {
    console.error('[CalDAV] Error creating booking event:', error);
    throw new Error('Failed to create calendar event');
  }
}
