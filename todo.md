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

## Calendar Verification
- [ ] Create diagnostic script to verify Feishu calendar visibility
- [ ] Check if calendar events are properly created with owner as attendee

## Homepage Development
- [x] Copy coach profile photo to project public directory
- [x] Create homepage component with hero section, about, services, and contact
- [x] Update App.tsx to route root path to homepage
- [x] Design professional layout matching coach's personal brand

## Email Notification Feature
- [x] Add email field to booking_user table schema
- [x] Update admin UI to include email input when creating users
- [x] Configure Gmail SMTP service (daughterofsalem@gmail.com)
- [x] Implement email sending service using nodemailer
- [x] Send booking confirmation email after successful booking
- [x] Test email delivery

## Admin Dashboard Enhancement
- [x] Display user email addresses in admin dashboard user list

## Database Updates
- [x] Update Connie Yu's email to ywlconnie@126.com

## Email Notification Enhancement
- [x] Send booking confirmation email to coach (sw2703@icloud.com) in addition to customer
- [x] Implement cancellation email notification for customers
- [x] Send cancellation email to coach (sw2703@icloud.com) when booking is cancelled

## Email Sender Migration
- [x] Update GMAIL_USER to ywlconnie@gmail.com
- [x] Update GMAIL_APP_PASSWORD with new credentials
- [x] Test email sending with new account

## WeChat QR Code Integration
- [x] Crop QR code from uploaded image (remove header and footer text)
- [x] Save cropped QR code to project public directory
- [x] Update homepage to display WeChat QR code in contact section

## WeChat QR Code Refinement
- [x] Re-crop QR code to remove top edge and bottom gray text
- [x] Verify cropped QR code displays correctly

## Comprehensive System Updates (Jan 2026)
- [x] Replace all instances of "课程" with "约谈" across web, email, and calendar
- [x] Remove 24-hour booking/cancellation restriction (allow if appointment time > current time)
- [x] Remove weekly 3-booking limit for unlimited subscription users
- [x] Hide past appointments in customer booking interface
- [x] Update coach credentials: "ICF教练PCC认证中；LUXXprofile动机分析师认证中；中国心理卫生协会证书"
- [x] Update Tencent Meeting link to https://meeting.tencent.com/p/5146842585
- [x] Replace homepage photo with new white background photo (connie_white.jpg)
- [x] Replace all instances of "康妮" with "Connie"
- [x] Swap order of "职业兴趣深度发掘" and "跨行转岗战略咨询" service cards

## Client Testimonials Addition
- [x] Add testimonials section to homepage with 4 client reviews
- [x] Design testimonials layout with professional styling
- [x] Include client role/company information with each testimonial

## Coach Email Address Update
- [x] Change coach email from sw2703@icloud.com to ywlconnie@icloud.com in all email notifications

## Target Audience Section Restructuring
- [x] Remove "适合人群" from career transition service card
- [x] Create standalone "适合人群" section between core services and testimonials

## Section Reordering
- [x] Delete standalone "适合人群" section
- [x] Move contact section before testimonials section

## Restore Target Audience Section
- [x] Restore "适合人群" section between core services and contact sections

## Contact Section Background Update
- [x] Change contact section background from dark (slate-900) to light inviting color scheme
