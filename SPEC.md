# NICHE — Complete build specification

**Single source of truth** for the Niche platform: anonymous, consent-gated marketplace for fetish-aware professional services across industries.

**Tagline:** *Ashley Madison for fetishes, across every industry* — with progressive trust, verification, and local markets.

---

## Where this repo implements the spec

| Area | Location |
|------|----------|
| **Part 3 — Working prototype (JSX)** | [`docs/PROTOTYPE.jsx`](docs/PROTOTYPE.jsx) — paste into a Next client route or Storybook |
| **Part 4 — Design system (JSX)** | [`docs/DESIGN-SYSTEM.jsx`](docs/DESIGN-SYSTEM.jsx) — reference; **live** gallery: `/design-system` → `DesignSystemShowcase.tsx` + `tokens.ts` |
| DB schema, PostGIS, seeds | `supabase/migrations/20260330120000_initial_schema.sql`, `20260330120100_user_pii_spec_alignment.sql` |
| RLS | `supabase/migrations/20260330120200_rls_policies.sql` |
| Trust ladder (stages, transitions, UI strip) | `src/lib/connection-stages.ts` — exports `CONNECTION_STAGES`, **`STAGES`** (spec alias), `canTransition`, `validateStageForAction`, `TRUST_LADDER_UI` |
| PII encryption (AES-256-GCM) | `src/lib/encryption.ts` |
| Message moderation | `src/lib/moderation.ts` |
| Tailwind + CSS variables | `tailwind.config.ts`, `src/app/globals.css` |
| Env template | `.env.example` |
| Prototype porting notes | [`docs/PROTOTYPE.md`](docs/PROTOTYPE.md) |

### Pricing models: reconcile before build

- **Part 1 (technical / marketplace)** describes ~**15% platform commission** on sessions, Stripe Connect splits, provider-paid Checkr, etc.
- **Part 5 (business plan)** describes **Niche Pass** ($19.99/mo) + **5% booking fee** on seekers, deferred Connect, manual payouts at MVP.

Pick **one** canonical monetization story for v1 and align `bookings` fee fields, Stripe flows, and copy. This repo’s schema uses `platform_fee_cents` / `provider_payout_cents` — map your chosen model to those columns.

---

## Part 1 — Product & technical specification

### Concept (one paragraph)

Niche is an anonymous, consent-gated marketplace where people with fetishes find willing service providers across **any** industry. Everyone is anonymous by default (alias, gradient avatar, metro-level location). Identity and contact data unlock only through a **mutual** progressive trust ladder. ID verification (e.g. Persona) runs **after** consent to meet, not at casual signup.

### Core principles (non-negotiable)

1. Anonymous until consent.  
2. Consent unlocks identity (progressive).  
3. Every industry (categories + tags).  
4. Local / geo-bounded markets (PostGIS).  
5. Structural consent at each stage.  
6. Safety is the product (verification, reports, check-ins).

### Tech stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS  
- **Backend:** Next.js Route Handlers + **Supabase** (Postgres, Auth, Realtime, Storage)  
- **Geo:** PostGIS  
- **ID:** Persona (inquiry id + flags only in DB — no ID images locally)  
- **Providers:** Checkr (after reveal / internal policy)  
- **Payments:** Stripe Connect (Part 1) *or* subscription + simple checkout (Part 5 MVP) — **choose**  
- **Email / SMS:** Resend, Twilio  
- **Hosting:** Vercel + Supabase  

### User types

- **Seekers** — browse, request connections, message under alias.  
- **Providers** — anonymous profiles, boundaries, rates, portfolio rules.  
- **Both** — one account, two modes.  
- **Admin** — `users.role = 'admin'` for `/admin` (middleware must check DB role).

### Anonymous layer (summary)

**Before consent:** alias, category, tags, vibe, anonymous portfolio rules, metro + distance, ratings (anonymous), verification **badges** (platform-internal meaning), no real name, no face, no exact address, no phone/social/license in UI.

**Trust ladder (stages):**  
1. **Anonymous** — chat only.  
2. **Photos** — mutual opt-in; voluntary photos; still no names/addresses.  
3. **Meet + consent form** — agreed activities as **tag IDs**, hard limits, safe word; both sign.  
4. **ID verification** — Persona; first name (+ optional last) and verified selfie **between parties** once both pass; still no address/phone in chat.  
5. **Booking + address** — provider location from saved locations, optional phone shares, deposit/payment per policy.

**Hard rule:** No addresses or off-platform contact until **photos + signed consent + both verified** (see product copy in prototype).

### Database schema

Canonical SQL lives in migrations. Summary:

- **`users`** — `email`, `alias`, `role` (`seeker` | `provider` | `both` | `admin`), profile fields, `metro_area`, `geo` (geography), verification **flags**, **no** plaintext PII after `user_pii` migration.  
- **`user_pii`** — `BYTEA` ciphertext: first/last name, DOB, verified selfie ref, phone.  
- **`provider_profiles`**, **`categories`**, **`tags`**, **`provider_tags`**, **`seeker_interests`**, **`provider_locations`**, **`markets`**, **`connections`** (full `stage` enum + photo/meet/consent/verify/booking columns), **`messages`**, **`bookings`**, **`consent_forms`**, **`reviews`**, **`reports`**.

### All pages to build

See **PROJECT FILE STRUCTURE** below. Public: `/`, `/about`, `/faq`, `/providers`, `/terms`, `/privacy`, `/safety`. Auth: `/signup`, `/login`, `/verify-phone`, `/verify-age`, `/verify-identity`, … App: `/explore`, `/provider/[alias]`, `/connections`, `/connections/[id]`, nested photos/consent/book, `/bookings`, `/settings`, provider `/provider/*`, `/admin/*`.

### API routes

Full list in kickoff below: `/api/auth/*`, `/api/users/*`, `/api/providers/*`, `/api/connections/[id]/*` (photos, meet, consent, verify, share-location, block, …), `/api/bookings/*`, `/api/reviews/*`, `/api/reports/*`, `/api/payments/*`, `/api/markets/*`, `/api/admin/*`. **Every** response that touches another user must use **`validateStageForAction`** (or equivalent) and strip PII.

### User flows

1. Seeker signup — email/password or OAuth, alias, 18+ DOB, phone, metro, optional tags → marketplace.  
2. Provider signup — seeker baseline + onboarding wizard + consent cert + BG + Stripe (per policy).  
3. Discovery — `/explore` filters, cards, profile.  
4. Connection — message, moderation, notifications.  
5. Trust ladder — photo request/consent, meet request, consent form, Persona, booking.  
6. Session day — start/complete, capture, check-in, review.  
7. Safety — report, panic, admin queue.

### Seed data

**Categories** (examples): Barber, Massage, Esthetician, Nail, Wax, Touch Therapist, Dental, Chiro, Trainer, Yoga, Tailor, Podiatry, Photo, Makeup, Tattoo, Piercing, Dermatology, PT, Acupuncture, Reiki, House Cleaner, Shoe Fitter, Optometry, Audiology, Nurse/Phlebotomist, Other — with emoji per spec.

**Tags** — types: `interest`, `sensation`, `dynamic`, `equipment`, `boundary`; use neutral/clinical names in DB.

### Environment variables

See `.env.example` — Supabase URL/keys, Persona, Checkr, Stripe, Twilio, Resend, `NEXT_PUBLIC_APP_URL`, `ENCRYPTION_KEY`, `JWT_SECRET`.

### Project file structure

```
niche/
├── SPEC.md
├── docs/
│   ├── DESIGN-SYSTEM.jsx    ← Part 4 reference JSX
│   ├── PROTOTYPE.jsx        ← Part 3 reference JSX
│   └── PROTOTYPE.md
├── src/app/                 ← Next.js App Router (see spec tree: (public), (auth), (app), admin, api)
├── src/components/
├── src/lib/
├── supabase/migrations/
└── ...
```

Implement the tree incrementally; this repo currently has foundation + design-system + migrations + libs.

### Row Level Security

Policies must match production auth mapping: **`public.users.id` = `auth.users.id`**. Reference migration `20260330120200_rls_policies.sql`. Patterns:

- `users` — public read active/non-banned; update own.  
- `user_pii` — select/insert/update/delete **own** row only.  
- `provider_profiles` — public read visible/accepting; update own.  
- `connections` / `messages` — parties only.  
- `bookings` / `reviews` — participant rules.

### Message auto-moderation

Implemented in `src/lib/moderation.ts` — `moderateMessage()`, `MODERATION_NOTICE`. Align regex lists with the spec; do not return blocked body to peers.

### Connection stage machine

Implemented in `src/lib/connection-stages.ts`. Spec excerpt:

- Valid transitions: `anonymous` → `photos_requested` → `photos_shared` → `meet_requested` → `consent_pending` → `consent_signed` → `verification_pending` → `verified` → `booking_ready` → `booking_active` → `completed` (plus `blocked` / `expired`).  
- `validateStageForAction` gates `send_message`, `request_photos`, `request_meet`, `sign_consent`, `start_verify`, `share_address`, `view_photos`, etc.

### Auth middleware

Create `src/middleware.ts` + `src/lib/supabase/middleware.ts` using `@supabase/ssr` as in the spec: public paths, auth paths (redirect if logged in), protected paths, admin role check via `users.role`.

### API route pattern

Server-only Supabase client; fetch connection; build DTO with stage-based stripping; decrypt `user_pii` only on server; never emit raw `BYTEA`.

### Cursor kickoff (Phase 1)

1. Read **SPEC.md** and migrations.  
2. TypeScript + Tailwind + App Router (`src/`) — done in this repo baseline.  
3. Install as needed: `@supabase/supabase-js`, `@supabase/ssr`, `stripe`, `@persona-id/inquiry`, `resend`.  
4. Wire Supabase Auth; on signup insert `public.users` row with `id = auth.uid()`.  
5. RLS + `user_pii` encryption on write.  
6. Middleware for protected routes.  
7. Port `docs/PROTOTYPE.jsx` to e.g. `src/app/prototype/page.tsx` when ready.

### Build order (phases)

Use the phase checklist from the master doc (foundation → provider → marketplace → connections/messaging → trust ladder → bookings/payments → safety/reviews → data protection/polish). Message auto-expiry cron, consent note TTL, account deletion, and key rotation are **follow-up** migrations/jobs.

### Critical rules for the Cursor agent

1. No PII in UI until stage allows.  
2. Strip PII in all cross-user APIs.  
3. Encrypt PII at rest; Persona holds documents.  
4. Moderate anonymous chat.  
5. Geo-gate browse.  
6. 18+ everywhere.  
7. Signed consent before booking.  
8. Checkr for providers only.  
9. Reviews anonymous by default.  
10. **Not** a sexual-services marketplace — ToS + moderation.

### Data minimization & user protection

ID data stays with Persona; messages auto-delete (cron); consent `additional_notes` encrypted + TTL; hard delete on account closure with anonymized retention where required; minimal logs; Stripe holds card data; `ENCRYPTION_KEY` off-DB; shutdown playbook in spec.

### Complete design system

Tokens, typography, spacing, radii, shadows, motion, and components are defined in **Part 4** ([`docs/DESIGN-SYSTEM.jsx`](docs/DESIGN-SYSTEM.jsx)) and implemented for Next.js at **`/design-system`** using `tailwind.config.ts` and `globals.css`.

---

## Part 2 — Go-to-market brief (summary)

**Problem:** No safe, structured way to match fetish-related *professional service* intent with willing providers; providers cannot signal safely on mainstream booking apps.

**Solution:** Two-sided marketplace with anonymity, trust ladder, verification, local density, payments.

**Differentiators:** Anonymous-first, all industries, trust ladder, geo markets, premium pricing power.

**Launch:** Supply-first (providers), 1–2 metros; legal (FOSTA-SESTA, licensing, GDPR/CCPA); Stripe category clarity.

**Channels:** FetLife, careful Reddit participation, SEO long-tail (“kink-aware barber”, etc.), events.

Full narrative, comps, and launch considerations are in your master document; operational detail is expanded in Part 5.

---

## Part 3 — Working prototype (React/JSX)

**Authoritative file:** [`docs/PROTOTYPE.jsx`](docs/PROTOTYPE.jsx)

Single-file app: landing, `VerificationGate`, marketplace grid, provider profile, connection thread with ladder, connections list, bookings, provider dashboard. Port to `src/app/prototype/page.tsx` (`"use client"`) when wiring Next.js.

---

## Part 4 — Design system component library (React/JSX)

**Authoritative file:** [`docs/DESIGN-SYSTEM.jsx`](docs/DESIGN-SYSTEM.jsx)

**Running in this app:** [http://localhost:3000/design-system](http://localhost:3000/design-system) — `src/components/design-system/DesignSystemShowcase.tsx` (uses `next/font`, Tailwind).

---

## Part 5 — Complete business plan (summary)

**Revenue (Part 5 model):** Niche Pass **$19.99/mo** (unlocks messaging / ladder / booking); **5%** booking fee on seeker at checkout; providers keep listed rate; featured tier deferred.

**MVP scope (Part 5):** Subscription paywall; manual ID review optional; defer Persona/Connect/Checkr until revenue thresholds; waitlist landing first.

**Operations:** Daily support + verification glance; weekly payouts (manual until Connect), content, email; monthly metrics and SEO batch.

**Launch sequence:** LLC/domain/email/Stripe/Supabase → waitlist → build core app → seed providers → soft launch → iterate.

**Metrics:** Waitlist, signups, browse→subscribe, MRR, messages/day, ladder progression, bookings, churn, provider count.

**Risks:** Stripe account, legal, thin supply, off-platform leakage, bad actors, conversion/churn — mitigations in full plan.

**Key success factor:** First ~15 quality providers in-market before blasting demand.

---

*End of SPEC.md. Part 3 and Part 4 JSX are maintained as separate files under `docs/` for size and clarity.*
