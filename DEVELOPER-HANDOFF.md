# One Touch Beauty — Developer Handoff Guide

**Date:** 30 March 2026
**Project Owner:** Creative Colver

---

## 📋 Project Overview

One Touch Beauty is a UK beauty marketplace that connects customers with local salons, hairdressers, and beauty professionals. Think "Fresha/Treatwell but UK-focused with lower commission."

The platform consists of three parts:

| Component | Tech Stack | Repo | Live URL |
|-----------|-----------|------|----------|
| **Web App** | Next.js 16 + React 19 + Tailwind 4 | [onetouchbeauty](https://github.com/CreativeColver-lgtm/onetouchbeauty) | [onetouchbeauty-phi.vercel.app](https://onetouchbeauty-phi.vercel.app) |
| **Mobile App** | Expo SDK 55 + React Native + TypeScript | [onetouchbeauty-app](https://github.com/CreativeColver-lgtm/onetouchbeauty-app) | Not yet published |
| **Database** | Supabase (PostgreSQL + Auth + Storage) | Migrations in web app repo | [Dashboard](https://supabase.com/dashboard/project/cguyvppsppxbvstjqmje) |

---

## 🏗️ What's Built (~90% Complete)

### Database — 30+ Tables
- Core: profiles, businesses, services, bookings, reviews, favourites, availability, blocked_dates, business_photos
- Staff: staff_members, staff_services, staff_schedules, staff_breaks
- Client CRM: client_profiles, client_notes
- Loyalty: loyalty_programs, loyalty_rewards, loyalty_balances, loyalty_transactions
- Notifications: reminders, notification_log
- Booking enhancements: waitlist, cancellation_policies, booking_deposits
- Forms: consultation_forms, consultation_responses
- Inventory: inventory_products, inventory_transactions
- Marketing: marketing_campaigns, referral_codes, referral_uses

### Web App — 86 files, 18,253 lines
**Pages (31 routes):**
- Homepage with slideshow hero, search, featured salons, testimonials
- Salon directory with search, filters, sorting
- Individual salon pages with team, reviews, booking
- Multi-step booking flow (service → staff → date → time → consultation → confirm)
- Business dashboard: overview, calendar, staff, clients CRM, inventory, campaigns, loyalty, cancellation policy, consultation forms, QR code, marketing
- Client dashboard
- Rewards & loyalty page
- Waitlist page
- Auth: login, register, business register, forgot password
- Static: about, contact, FAQs, blog, privacy, terms, cookies, pricing, gallery, collections

**API Routes:**
- `/api/checkout` — Stripe payment processing
- `/api/webhooks/stripe` — Stripe webhook handler
- `/api/reminders/send` — Send email/SMS reminders (Resend + Twilio)
- `/api/reminders/cron` — Automated reminder scheduling (runs every 15 min via Vercel cron)
- `/api/notifications` — Booking confirmations, review requests
- `/api/loyalty` — Points earn/redeem
- `/api/waitlist` — Join/check/leave waitlist

**Components (20+):** Navbar, Footer, StaffSelector, ConsultationForm, CancellationPolicy, LoyaltyCard, CampaignBuilder, InventoryTable, AddToCalendar, ShareButton, RatingBreakdown, WaitlistButton, and more.

**Lib Functions:** Staff management, loyalty system, waitlist, inventory, campaigns, reminders, notifications.

### Mobile App — 71 files, 20,892 lines
**Customer Screens:**
- Home (personalised greeting, upcoming booking, near you, trending)
- Search (location-based, filters, sort, recent searches)
- Salon detail with team, reviews, booking
- Multi-step booking flow with staff selection, consultation forms
- Booking confirmation with add-to-calendar
- Bookings list with countdown timers, rebook, review
- Rewards & loyalty cards with tier progress
- Notifications centre with badge count
- Profile with preferences, favourites, notification settings
- Waitlist join

**Business Screens:**
- Dashboard (revenue, bookings, retention, no-show rate, quick actions)
- Calendar (multi-staff column view, colour-coded statuses)
- Analytics (revenue charts, top services, client acquisition)
- Staff management
- Client CRM (profiles, notes, history, lifetime value)
- Inventory management
- Marketing campaigns builder
- Loyalty program setup
- Cancellation policy editor
- Consultation form builder
- Settings

**Components (20+):** StaffCard, StaffSelector, ConsultationForm, CancellationPolicyCard, LoyaltyCard, NotificationItem, RevenueChart, BookingCountdown, QuickActions, ShareSheet, AddToCalendar, RatingBreakdown, and more.

---

## ⚡ What Needs Finishing

### Priority 1 — Critical for Launch

#### 1. Run Database Migration (~1 hour)
The new tables (staff, loyalty, inventory, campaigns, etc.) need to be deployed to Supabase.
- Migration file: `supabase/migrations/002_platform_upgrade.sql`
- Run against: Supabase project `cguyvppsppxbvstjqmje`
- Can be run via Supabase Dashboard SQL Editor or `supabase db push`

#### 2. Real Stripe Payment Endpoint (~6-10 hours)
- Current state: Payment flow uses mock/test mode in `lib/stripe.ts` (mobile) and `/api/checkout` (web)
- Needed: Create a Supabase Edge Function or update the API route to:
  - Create real PaymentIntents server-side
  - Handle Stripe webhooks (payment_intent.succeeded, payment_intent.failed)
  - Update booking status and booking_deposits on payment
  - Switch from test keys to live keys when ready
- Stripe test keys are already configured (see Credentials section below)

#### 3. Push Notifications (~5-8 hours)
- `expo-notifications` is installed and configured in `app.json`
- Need to:
  - Set up APNs certificates (iOS) and FCM (Android) in Expo/EAS
  - Add notification trigger functions (booking confirmed, reminder, review request, waitlist availability)
  - Register device push tokens on login
  - Send via Expo Push API

#### 4. Email/SMS Confirmations (~4-6 hours)
- API routes are built (`/api/reminders/send`, `/api/notifications`)
- Needs: **Twilio account** (SMS) and **Resend account** (email)
- Plug in credentials as env vars:
  - `RESEND_API_KEY`
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`
- The code checks for these and gracefully skips if missing

#### 5. Testing & Bug Fixes (~5-10 hours)
- End-to-end testing of complete booking flow (search → book → pay → confirm → remind)
- Payment edge cases (double bookings, failures, refunds, network errors)
- Auth flow testing (register, login, forgot password, session management)
- Business dashboard data accuracy
- Mobile app on real devices (iOS + Android)

### Priority 2 — Required for App Store

#### 6. Apple Developer Account Setup
- Owner needs to register at [developer.apple.com/programs](https://developer.apple.com/programs/enroll/) — **£79/year**
- Add developer as team member
- Generate signing certificates and provisioning profiles

#### 7. Google Play Developer Account
- Register at [play.google.com/console](https://play.google.com/console) — **£20 one-off**

#### 8. iOS App Store Submission (~3-5 hours)
- Build via EAS: `eas build --platform ios --profile production`
- Generate screenshots (6.7" iPhone, 5.5" iPhone, iPad)
- App Store listing copy is ready in `APP-STORE-LISTING.md`
- Privacy Policy is ready in `PRIVACY-POLICY.md` (needs hosting as URL)
- Submit via EAS Submit or Xcode
- Apple review: typically 1-3 days

#### 9. Android Play Store Submission (~2-4 hours)
- Build via EAS: `eas build --platform android --profile production`
- Generate feature graphic (1024x500) + screenshots
- Play Store listing copy is ready in `APP-STORE-LISTING.md`
- Submit via EAS Submit or Google Play Console
- Google review: typically 1-7 days

### Priority 3 — Nice to Have (Post-Launch)

#### 10. Google/Instagram/Facebook Booking Integration
- Allow booking from Google Business Profile
- Instagram "Book" button integration
- Facebook page booking tab

#### 11. Caching & Offline Support
- React Query / SWR for data caching on web
- AsyncStorage caching on mobile
- Offline-first booking queue

#### 12. Performance Optimisation
- Image optimisation (next/image is configured but real salon photos need CDN)
- Bundle size analysis
- Lazy loading for dashboard charts

#### 13. SEO & Marketing Pages
- Dynamic meta tags for salon pages
- Sitemap generation
- Blog content for SEO

---

## 🔑 Credentials & Access

**⚠️ DO NOT commit these to GitHub. Share via secure channel only.**

Credentials file location (local only, not in repo):
`/Users/creativecolver/.openclaw/workspace/onetouchbeauty-app/CREDENTIALS-CONFIDENTIAL.md`

### Supabase
- Project URL: `https://cguyvppsppxbvstjqmje.supabase.co`
- Dashboard: `https://supabase.com/dashboard/project/cguyvppsppxbvstjqmje`
- Anon Key and Service Role Key → see credentials file

### Stripe (TEST keys — no real charges)
- Dashboard: `https://dashboard.stripe.com`
- Test Secret Key and Publishable Key → see credentials file

### Environment Variables

**Web app `.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=https://cguyvppsppxbvstjqmje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<see credentials file>
SUPABASE_SERVICE_ROLE_KEY=<see credentials file>
STRIPE_SECRET_KEY=<see credentials file>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<see credentials file>
NEXT_PUBLIC_SITE_URL=https://onetouchbeauty-phi.vercel.app
RESEND_API_KEY=<needs Resend account>
TWILIO_ACCOUNT_SID=<needs Twilio account>
TWILIO_AUTH_TOKEN=<needs Twilio account>
TWILIO_PHONE_NUMBER=<needs Twilio account>
```

**Mobile app `.env`:**
```
EXPO_PUBLIC_SUPABASE_URL=https://cguyvppsppxbvstjqmje.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<see credentials file>
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=<see credentials file>
```

### Accounts Still Needed
| Account | Cost | Purpose | Sign up |
|---------|------|---------|---------|
| **Apple Developer** | £79/year | iOS App Store submission | [developer.apple.com](https://developer.apple.com/programs/enroll/) |
| **Google Play Developer** | £20 one-off | Android Play Store | [play.google.com/console](https://play.google.com/console) |
| **Twilio** | ~£1/month + 3p/SMS | SMS booking reminders | [twilio.com](https://www.twilio.com) |
| **Resend** | Free (3,000 emails/month) | Email confirmations & campaigns | [resend.com](https://resend.com) |
| **Stripe (Live)** | Transaction fees only | Real payment processing | Already have test account |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`) — for app builds

### Web App
```bash
git clone https://github.com/CreativeColver-lgtm/onetouchbeauty.git
cd onetouchbeauty
npm install
# Create .env.local with credentials above
npm run dev
# Opens at http://localhost:3000
```

### Mobile App
```bash
git clone https://github.com/CreativeColver-lgtm/onetouchbeauty-app.git
cd onetouchbeauty-app
npm install
# Create .env with credentials above
npx expo start
# Scan QR code with Expo Go app, or press i for iOS simulator
```

### Database Migration
```bash
# Option 1: Via Supabase Dashboard
# Go to SQL Editor → paste contents of supabase/migrations/002_platform_upgrade.sql → Run

# Option 2: Via CLI
npm install -g supabase
supabase login
supabase link --project-ref cguyvppsppxbvstjqmje
supabase db push
```

---

## 📁 Project Structure

### Web App
```
src/
├── app/                    # Next.js pages (App Router)
│   ├── api/                # API routes
│   ├── booking/            # Booking flow
│   ├── dashboard/          # Business & client dashboards
│   ├── directory/          # Salon discovery
│   ├── salon/[id]/         # Individual salon pages
│   └── ...                 # Other pages
├── components/             # Reusable UI components
├── lib/                    # Business logic & API functions
├── types/                  # TypeScript type definitions
├── context/                # React contexts (auth, theme)
└── hooks/                  # Custom React hooks
```

### Mobile App
```
app/
├── (tabs)/                 # Customer tab screens
│   ├── index.tsx           # Home
│   ├── search.tsx          # Browse/search
│   ├── bookings.tsx        # My bookings
│   ├── rewards.tsx         # Loyalty & rewards
│   ├── notifications.tsx   # Notification centre
│   └── profile.tsx         # User profile
├── (business)/             # Business management screens
│   ├── dashboard.tsx       # Business overview
│   ├── calendar.tsx        # Booking calendar
│   ├── analytics.tsx       # Revenue & stats
│   ├── staff.tsx           # Staff management
│   ├── clients-crm.tsx     # Client CRM
│   ├── inventory.tsx       # Product inventory
│   ├── campaigns.tsx       # Marketing campaigns
│   ├── loyalty-setup.tsx   # Loyalty program
│   └── ...                 # More business screens
├── (auth)/                 # Login, register, forgot password
├── booking/                # Booking flow & confirmation
├── salon/[id].tsx          # Salon detail
└── waitlist/               # Waitlist screens
components/                 # Shared UI components
lib/                        # Business logic & Supabase queries
constants/                  # Theme & config
```

---

## 💰 Estimated Cost to Finish

| Task | Hours | Cost (£40-60/hr) |
|------|:-----:|:---------:|
| Run database migration | 1 | £40-60 |
| Real Stripe payment endpoint | 6-10 | £300-500 |
| Push notifications | 5-8 | £250-400 |
| Email/SMS confirmations | 4-6 | £200-300 |
| Testing & bug fixes | 5-10 | £250-500 |
| iOS App Store submission | 3-5 | £150-250 |
| Android Play Store submission | 2-4 | £100-200 |
| **Total** | **26-44** | **£1,290-2,210** |

**Additional costs:**
- Apple Developer Account: £79/year
- Google Play Developer Account: £20 (one-off)
- Twilio: ~£1/month + ~3p per SMS
- Resend: Free up to 3,000 emails/month
- Stripe: 1.4% + 20p per transaction (standard UK rate)

---

## ⚠️ Important Notes for the Developer

1. **Don't rewrite the codebase.** It's clean, modern (Next.js 16, Expo SDK 55, React 19), and well-structured. If someone suggests starting over, that's a red flag.

2. **The database migration MUST run first** before new features (staff, loyalty, inventory, etc.) will work on the live site.

3. **Test keys are configured** — the app works end-to-end in test mode. Switch to live Stripe keys only when ready to accept real payments.

4. **Both repos are TypeScript** — there are zero type errors in the current build. Keep it that way.

5. **The web app auto-deploys** to Vercel on push to main. The mobile app needs EAS Build for store submissions.

6. **Privacy Policy** needs to be hosted at a public URL before app store submission. It's written and ready in `PRIVACY-POLICY.md` — just needs to be added as a page (or host on the website).

---

## 📞 Contact

**Project Owner:** Creative Colver
**AI Assistant:** ColverClaw (built the majority of this codebase)
