import axios from 'axios';

interface FeishuConfig {
  appId: string;
  appSecret: string;
  calendarId?: string; // Optional: specific calendar ID, defaults to primary
}

interface FeishuAccessToken {
  token: string;
  expiresAt: number; // Timestamp when token expires
}

interface CalendarEvent {
  uid: string;
  summary: string;
  startTime: number; // UTC timestamp in milliseconds
  endTime: number; // UTC timestamp in milliseconds
  location?: string;
  description?: string;
}

interface BusyBlock {
  startTime: number; // UTC timestamp in milliseconds
  endTime: number; // UTC timestamp in milliseconds
}

// Cache for access token
let cachedToken: FeishuAccessToken | null = null;

/**
 * Get Feishu configuration from environment variables
 */
export function getFeishuConfig(): FeishuConfig | null {
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;
  const calendarId = process.env.FEISHU_CALENDAR_ID; // Optional

  if (!appId || !appSecret) {
    console.warn('[Feishu] Missing configuration');
    return null;
  }

  return { appId, appSecret, calendarId };
}

/**
 * Get tenant access token for Feishu API
 */
async function getTenantAccessToken(config: FeishuConfig): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        app_id: config.appId,
        app_secret: config.appSecret,
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Feishu auth failed: ${response.data.msg}`);
    }

    const token = response.data.tenant_access_token;
    const expiresIn = response.data.expire; // seconds

    // Cache token with 5-minute buffer before expiration
    cachedToken = {
      token,
      expiresAt: Date.now() + (expiresIn - 300) * 1000,
    };

    return token;
  } catch (error) {
    console.error('[Feishu] Failed to get access token:', error);
    throw new Error('Failed to authenticate with Feishu');
  }
}

/**
 * Get the first available calendar ID for the current user
 */
async function getFirstCalendarId(accessToken: string): Promise<string> {
  try {
    // List all calendars for the user
    const response = await axios.get(
      'https://open.feishu.cn/open-apis/calendar/v4/calendars',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page_size: 50,
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Failed to list calendars: ${response.data.msg}`);
    }

    const calendars = response.data.data?.calendar_list || [];
    
    if (calendars.length === 0) {
      throw new Error('No calendars found');
    }

    // Return the first calendar (usually the primary one)
    const firstCalendar = calendars[0];
    console.log(`[Feishu] Using calendar: ${firstCalendar.summary} (${firstCalendar.calendar_id})`);
    
    return firstCalendar.calendar_id;
  } catch (error) {
    console.error('[Feishu] Failed to get calendar:', error);
    throw new Error('Failed to get Feishu calendar');
  }
}

/**
 * Fetch busy blocks from Feishu calendar within a date range
 */
export async function fetchBusyBlocks(
  startDate: Date,
  endDate: Date
): Promise<BusyBlock[]> {
  const config = getFeishuConfig();
  if (!config) {
    throw new Error('Feishu configuration not available');
  }

  try {
    const accessToken = await getTenantAccessToken(config);
    const calendarId = config.calendarId || (await getFirstCalendarId(accessToken));

    // Convert dates to Unix timestamps (seconds)
    const startTimeMin = Math.floor(startDate.getTime() / 1000);
    const endTimeMax = Math.floor(endDate.getTime() / 1000);

    // Fetch events from Feishu Calendar
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/calendar/v4/calendars/${calendarId}/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          start_time: startTimeMin,
          end_time: endTimeMax,
          page_size: 500, // Max events to fetch
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Failed to fetch events: ${response.data.msg}`);
    }

    const events = response.data.data?.items || [];
    const busyBlocks: BusyBlock[] = [];

    for (const event of events) {
      // Only include events that are not declined or cancelled
      if (event.status === 'cancelled') {
        continue;
      }

      const startTime = parseInt(event.start_time?.timestamp || '0') * 1000;
      const endTime = parseInt(event.end_time?.timestamp || '0') * 1000;

      if (startTime && endTime) {
        busyBlocks.push({ startTime, endTime });
      }
    }

    return busyBlocks;
  } catch (error) {
    console.error('[Feishu] Failed to fetch busy blocks:', error);
    throw new Error('Failed to fetch calendar availability');
  }
}

/**
 * Create a new event in the Feishu calendar
 */
export async function createCalendarEvent(event: CalendarEvent): Promise<void> {
  const config = getFeishuConfig();
  if (!config) {
    throw new Error('Feishu configuration not available');
  }

  try {
    const accessToken = await getTenantAccessToken(config);
    const calendarId = config.calendarId || (await getFirstCalendarId(accessToken));

    // Convert milliseconds to seconds for Feishu API
    const startTimeSeconds = Math.floor(event.startTime / 1000);
    const endTimeSeconds = Math.floor(event.endTime / 1000);

    // Feishu location field has strict format requirements, so put meeting link in description
    const descriptionWithLocation = event.location 
      ? `${event.description || ''}\n\n会议链接: ${event.location}`
      : event.description || '';

    // Add owner as attendee so event appears in their personal calendar
    const ownerOpenId = process.env.OWNER_OPEN_ID;
    const attendees = ownerOpenId ? [
      {
        attendee_user_id: ownerOpenId,
        is_optional: false,
        rsvp_status: "accept", // Auto-accept for owner
      }
    ] : [];

    const eventData = {
      summary: event.summary,
      description: descriptionWithLocation,
      start_time: {
        timestamp: startTimeSeconds.toString(),
      },
      end_time: {
        timestamp: endTimeSeconds.toString(),
      },
      attendee_ability: "can_see_others", // Allow attendees to see each other
      free_busy_status: "busy", // Mark as busy time
      attendees: attendees.length > 0 ? attendees : undefined,
      // Omit location field as it requires specific format
      // Use the event UID as idempotency key to prevent duplicates
      idempotency_key: event.uid,
    };

    const response = await axios.post(
      `https://open.feishu.cn/open-apis/calendar/v4/calendars/${calendarId}/events`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.code !== 0) {
      console.error('[Feishu] Create event error:', response.data);
      throw new Error(`Failed to create event: ${response.data.msg}`);
    }

    console.log('[Feishu] Calendar event created successfully:', event.uid);
  } catch (error: any) {
    if (error.response) {
      console.error('[Feishu] Failed to create calendar event:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error('[Feishu] Failed to create calendar event:', error.message);
    }
    throw new Error('Failed to create calendar event');
  }
}
