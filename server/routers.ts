import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import {
  getBookingUserBySlug,
  getBookingUserByMobile,
  createBookingUser,
  updateBookingUserCredits,
  updateBookingUserUnlimited,
  getAllBookingUsers,
  createBooking,
  getUserActiveBookings,
  getUserWeeklyBookings,
  cancelBooking,
  getBookingById,
  getAllUserBookings,
} from "./bookingDb";
import { getBusySlots, createBookingEvent } from "./caldav";
import { sendBookingConfirmation, sendBookingCancellation } from "./email";
import { TRPCError } from "@trpc/server";

// Helper: Get start and end of week (Monday to Sunday) for a given timestamp
function getWeekBounds(timestamp: number): { weekStart: number; weekEnd: number } {
  const date = new Date(timestamp);
  const dayOfWeek = date.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() + daysToMonday);
  monday.setUTCHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);
  
  return {
    weekStart: monday.getTime(),
    weekEnd: sunday.getTime(),
  };
}

// Helper: Generate available 60-minute slots
function generateAvailableSlots(
  startDate: Date,
  endDate: Date,
  busyBlocks: Array<{ startTime: number; endTime: number }>
): number[] {
  const slots: number[] = [];
  const now = Date.now();
  const twentyFourHoursFromNow = now + 24 * 60 * 60 * 1000;

  // Generate slots from 9 AM to 8 PM (last slot starts at 8 PM)
  // Parse the date components from startDate and create UTC timestamp for China timezone (UTC+8)
  const year = startDate.getFullYear();
  const month = startDate.getMonth();
  const day = startDate.getDate();
  // China time 09:00 = UTC 01:00 (because UTC+8)
  const current = new Date(Date.UTC(year, month, day, 1, 0, 0, 0));
  // China time 20:00 = UTC 12:00, so last slot ends at UTC 13:00
  const endOfDayUTC = Date.UTC(year, month, day, 13, 0, 0, 0);

  while (current.getTime() < endOfDayUTC) {
    const currentHour = current.getUTCHours();
    
    // Skip if slot is after 8 PM China time (20:00 China = 12:00 UTC)
    if (currentHour > 12) {
      // Move to next day at 9 AM China time (01:00 UTC)
      current.setUTCDate(current.getUTCDate() + 1);
      current.setUTCHours(1, 0, 0, 0);
      continue;
    }

    const slotStart = current.getTime();
    const slotEnd = slotStart + 60 * 60 * 1000; // 60 minutes

    // Skip if slot is in the past or within 24 hours
    if (slotStart < twentyFourHoursFromNow) {
      current.setUTCHours(current.getUTCHours() + 1);
      continue;
    }

    // Check if slot conflicts with any busy block
    const hasConflict = busyBlocks.some(
      (block) => slotStart < block.endTime && slotEnd > block.startTime
    );

    if (!hasConflict) {
      slots.push(slotStart);
    }

    current.setUTCHours(current.getUTCHours() + 1);
  }

  return slots;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  booking: router({
    // Get user info by access slug
    getUserBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const user = await getBookingUserBySlug(input.slug);
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }
        return user;
      }),

    // Get available time slots
    getAvailableSlots: publicProcedure
      .input(
        z.object({
          date: z.string(), // YYYY-MM-DD format
        })
      )
      .query(async ({ input }) => {
        // Parse date in local timezone (Asia/Shanghai)
        const [year, month, day] = input.date.split('-').map(Number);
        const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
        const busySlots = await getBusySlots(startDate.getTime(), endDate.getTime());
        const busyBlocks = busySlots.map(slot => ({ startTime: slot.start, endTime: slot.end }));

        const slots = generateAvailableSlots(startDate, endDate, busyBlocks);

        return { slots };
      }),

    // Get user's active bookings
    getUserBookings: publicProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        const bookings = await getUserActiveBookings(input.userId);
        return { bookings };
      }),

    // Create a new booking
    createBooking: publicProcedure
      .input(
        z.object({
          userId: z.string(),
          startTime: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const user = await getBookingUserByMobile(input.userId);
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        const now = Date.now();

        // Only check if booking time is in the future
        if (input.startTime <= now) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot book in the past",
          });
        }

        const endTime = input.startTime + 60 * 60 * 1000;

        // Check credit availability
        let creditType: "bulk" | "unlimited";
        const hasUnlimited =
          user.unlimitedExpiry && user.unlimitedExpiry > now;

        if (hasUnlimited) {
          creditType = "unlimited";
        } else {
          // Use bulk credits
          if (user.bulkCredits <= 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Insufficient credits",
            });
          }

          creditType = "bulk";
        }

        // Create calendar event first to ensure sync
        const bookingId = nanoid();
        const tencentMeetingUrl = process.env.TENCENT_MEETING_URL || "";
        
        try {
          await createBookingEvent(
            input.startTime,
            endTime,
            user.nickname,
            tencentMeetingUrl
          );
        } catch (error) {
          console.error('[Booking] Failed to create calendar event:', error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create calendar event. Please try again.",
          });
        }

        // Create booking in database after calendar event succeeds
        await createBooking({
          id: bookingId,
          userId: input.userId,
          startTime: input.startTime,
          endTime,
          status: "active",
          creditTypeUsed: creditType,
        });

        // Deduct bulk credit if applicable
        if (creditType === "bulk") {
          await updateBookingUserCredits(
            input.userId,
            user.bulkCredits - 1
          );
        }

        // Send confirmation email
        try {
          await sendBookingConfirmation({
            userEmail: user.email,
            userName: user.nickname,
            startTime: new Date(input.startTime),
            endTime: new Date(endTime),
          });
        } catch (error) {
          console.error('[Booking] Failed to send confirmation email:', error);
          // Don't fail the booking if email fails
        }

        return {
          success: true,
          bookingId,
          meetingUrl: tencentMeetingUrl,
        };
      }),

    // Cancel a booking
    cancelBooking: publicProcedure
      .input(z.object({ bookingId: z.string(), userId: z.string() }))
      .mutation(async ({ input }) => {
        const booking = await getBookingById(input.bookingId);
        if (!booking) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        }

        if (booking.userId !== input.userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Unauthorized" });
        }

        if (booking.status === "cancelled") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Booking already cancelled",
          });
        }

        const now = Date.now();

        // Only allow cancellation if booking is in the future
        if (booking.startTime <= now) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot cancel past bookings",
          });
        }

        // Get user info for email
        const user = await getBookingUserByMobile(input.userId);
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        // Cancel booking
        await cancelBooking(input.bookingId);

        // Refund bulk credit if applicable
        if (booking.creditTypeUsed === "bulk") {
          await updateBookingUserCredits(
            input.userId,
            user.bulkCredits + 1
          );
        }

        // Send cancellation email to user and coach
        try {
          await sendBookingCancellation({
            userEmail: user.email,
            userName: user.nickname,
            startTime: new Date(booking.startTime),
            endTime: new Date(booking.endTime),
          });
        } catch (error) {
          console.error("[Booking] Failed to send cancellation email:", error);
          // Don't fail the cancellation if email fails
        }

        return { success: true };
      }),
  }),

  admin: router({
    // Check if current user is admin
    isAdmin: protectedProcedure.query(({ ctx }) => {
      return { isAdmin: ctx.user.role === "admin" };
    }),

    // Get all booking users
    getAllUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const users = await getAllBookingUsers();
      return { users };
    }),

    // Create a new booking user
    createUser: protectedProcedure
      .input(
        z.object({
          mobileNumber: z.string(),
          nickname: z.string(),
          email: z.string().email(),
          bulkCredits: z.number().default(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        // Generate unique access slug
        const accessSlug = `${input.nickname.toLowerCase().replace(/\s+/g, '-')}-${nanoid(6)}`;

        await createBookingUser({
          mobileNumber: input.mobileNumber,
          accessSlug,
          nickname: input.nickname,
          email: input.email,
          bulkCredits: input.bulkCredits,
          unlimitedExpiry: null,
        });

        return { success: true, accessSlug };
      }),

    // Add bulk credits to user
    addCredits: protectedProcedure
      .input(
        z.object({
          mobileNumber: z.string(),
          amount: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const user = await getBookingUserByMobile(input.mobileNumber);
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        await updateBookingUserCredits(
          input.mobileNumber,
          user.bulkCredits + input.amount
        );

        return { success: true };
      }),

    // Set bulk credits directly
    setCredits: protectedProcedure
      .input(
        z.object({
          mobileNumber: z.string(),
          credits: z.number().min(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const user = await getBookingUserByMobile(input.mobileNumber);
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        await updateBookingUserCredits(
          input.mobileNumber,
          input.credits
        );

        return { success: true };
      }),

    // Activate unlimited subscription
    activateUnlimited: protectedProcedure
      .input(z.object({ mobileNumber: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const user = await getBookingUserByMobile(input.mobileNumber);
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        // Set expiry to 12 weeks from now
        const twelveWeeks = 12 * 7 * 24 * 60 * 60 * 1000;
        const expiry = Date.now() + twelveWeeks;

        await updateBookingUserUnlimited(input.mobileNumber, expiry);

        return { success: true, expiry };
      }),

    // Get user bookings (for admin view)
    getUserBookings: protectedProcedure
      .input(z.object({ mobileNumber: z.string() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const bookings = await getAllUserBookings(input.mobileNumber);
        return { bookings };
      }),
  }),
});

export type AppRouter = typeof appRouter;
