import { createDAVClient } from 'tsdav';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '/home/ubuntu/career_coach_booking/.env' });

async function listCalendars() {
  console.log('=== iCloud Calendar List ===\n');

  const caldavUrl = process.env.CALDAV_URL;
  const caldavUsername = process.env.CALDAV_USERNAME;
  const caldavPassword = process.env.CALDAV_PASSWORD;

  if (!caldavUrl || !caldavUsername || !caldavPassword) {
    console.error('❌ CalDAV credentials not configured');
    return;
  }

  try {
    // Create CalDAV client
    const client = await createDAVClient({
      serverUrl: caldavUrl,
      credentials: {
        username: caldavUsername,
        password: caldavPassword,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    });

    console.log('✅ Successfully connected to iCloud CalDAV\n');

    // Fetch all calendars
    const calendars = await client.fetchCalendars();

    if (!calendars || calendars.length === 0) {
      console.log('⚠️  No calendars found');
      return;
    }

    console.log(`Found ${calendars.length} calendar(s):\n`);

    calendars.forEach((calendar, index) => {
      console.log(`${index + 1}. ${calendar.displayName || '(Unnamed)'}`);
      console.log(`   URL: ${calendar.url}`);
      console.log(`   Description: ${calendar.description || 'N/A'}`);
      console.log(`   Timezone: ${calendar.timezone || 'N/A'}`);
      console.log(`   Color: ${calendar.calendarColor || 'N/A'}`);
      console.log('');
    });

    console.log('\n=== Recommendation ===');
    console.log(`The system will use: "${calendars[0].displayName || '(First calendar)'}"`);
    console.log('\nTo specify a different calendar, set CALDAV_CALENDAR_NAME to one of the names above.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listCalendars();
