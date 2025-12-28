# Project TODO

## Database Schema
- [x] Create users table with mobile_number, access_slug, nickname, bulk_credits, unlimited_expiry
- [x] Create bookings table with user_id, start_time, end_time, status, credit_type_used
- [x] Add admin role support

## Backend Features
- [x] Feishu Calendar API integration (read busy/free time)
- [x] Feishu Calendar write functionality to create booking events
- [x] User lookup by access_slug endpoint
- [x] Available time slots calculation (60-minute slots, excluding busy blocks)
- [x] Booking creation with credit validation logic
- [x] 24-hour booking rule enforcement
- [x] Weekly booking limit for unlimited users (max 3 per week)
- [x] Booking cancellation with 24-hour rule
- [x] Admin endpoints for user management
- [x] Admin endpoints for credit top-up (+1, +5)
- [x] Admin endpoints for unlimited subscription activation
- [x] Booking URL generator

## Frontend - User Booking Interface
- [x] URL slug parsing and user state loading
- [x] User status header (nickname + credits/unlimited status)
- [x] Mobile-first date picker for available slots
- [x] Time slot selection UI
- [x] Booking confirmation with Tencent Meeting link
- [x] Booking cancellation interface
- [x] All UI text in simplified Chinese

## Frontend - Admin Dashboard
- [x] Admin authentication check
- [x] User list with sorting (recent session, A-Z)
- [x] Manual credit top-up buttons (replaced with +10)
- [x] Unlimited subscription activation
- [x] Booking URL copy functionality
- [x] User bookings view

## Configuration & Environment
- [x] Environment variables setup (Feishu API credentials, Tencent Meeting URL)
- [x] Request Feishu App ID and App Secret from user
- [x] Request Tencent Meeting URL from user

## Testing & Deployment
- [x] Test complete user booking flow
- [x] Test admin dashboard functionality
- [x] Test Feishu Calendar integration
- [x] Create final checkpoint

## Bug Fixes
- [x] Fix time slot display showing duplicates and unreasonable hours (00:00-04:00)
- [x] Limit time slots to business hours (09:00-20:00)
- [x] Fix timezone issue: backend generates UTC timestamps with China offset (UTC+8)
- [x] Fix timezone issue: frontend displays China time from UTC timestamps

## New Feature Requests
- [x] Replace +1 and +5 credit buttons with single +10 button in admin dashboard
- [x] Make credit balance directly editable in admin dashboard
- [x] Add backend endpoint to update user credits directly

## Bug Fixes - Calendar UI
- [x] Fix calendar component bottom border rendering issue (border appearing on top of last row instead of below it on some browsers)
- [x] Fix calendar last row (29-4) being cut off by overflow-hidden on some browsers

## Bug Fixes - Calendar Sync
- [x] Investigate why bookings are not creating events in Feishu calendar
- [x] Fix booking creation order: create calendar event first, then database booking

## Investigation - Calendar Visibility
- [x] Investigate why Feishu calendar events are not visible despite successful API response
- [x] Check which Feishu account the calendar is associated with
- [x] Add owner as attendee to calendar events so they appear in owner's personal calendar
