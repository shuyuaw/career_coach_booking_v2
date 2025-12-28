import { createCalendarEvent } from './server/feishu.ts';
import { db } from './server/db.ts';
import { bookings, bookingUsers } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

async function syncBookingToCalendar() {
  try {
    // Get Li Ming's booking
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, '13912345678'))
      .orderBy(bookings.startTime)
      .limit(1);

    if (booking.length === 0) {
      console.log('No booking found for Li Ming');
      return;
    }

    const bookingData = booking[0];
    console.log('Found booking:', {
      id: bookingData.id,
      startTime: new Date(Number(bookingData.startTime)),
      endTime: new Date(Number(bookingData.endTime)),
      status: bookingData.status,
    });

    // Get user info
    const user = await db
      .select()
      .from(bookingUsers)
      .where(eq(bookingUsers.mobileNumber, '13912345678'))
      .limit(1);

    if (user.length === 0) {
      console.log('User not found');
      return;
    }

    const userData = user[0];
    console.log('User:', userData.nickname);

    // Create calendar event
    const tencentMeetingUrl = process.env.TENCENT_MEETING_URL || '';
    console.log('Creating calendar event...');
    
    await createCalendarEvent({
      uid: bookingData.id,
      summary: `[教练课程] ${userData.nickname}`,
      startTime: Number(bookingData.startTime),
      endTime: Number(bookingData.endTime),
      location: tencentMeetingUrl,
      description: `课时类型: ${bookingData.creditTypeUsed}`,
    });

    console.log('✅ Calendar event created successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

syncBookingToCalendar();
