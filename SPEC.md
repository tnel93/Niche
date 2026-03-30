# NICHE — Build specification (single source of truth)

**Tagline:** *Ashley Madison for fetishes, across every industry* — anonymous, consent-gated marketplace; identity only after the trust ladder.

This file is the **canonical product + engineering index** for the repo. Implementation lives next to it:

| Area | Location |
|------|----------|
| DB schema + seeds + RLS | `supabase/migrations/` |
| Trust ladder (types + transitions + UI labels) | `src/lib/connection-stages.ts` |
| PII encryption (AES-256-GCM) | `src/lib/encryption.ts` |
| Message moderation | `src/lib/moderation.ts` |
| Design tokens + component gallery | `src/components/design-system/`, `/design-system` |
| Env template | `.env.example` |

**Parts 3–4 of the master document** (full JSX prototype + design-system JSX) are **not** duplicated here in full (too large for one file). Integrate the prototype as a Next route (e.g. `/prototype`) by porting the JSX from your canonical doc into `docs/PROTOTYPE.tsx` or `src/app/prototype/page.tsx`. The **design system** is already implemented as `DesignSystemShowcase.tsx`.

---

## Part 1 — Product & technical (summary)

### Concept

Seekers and providers interact **by alias** until mutual consent moves them through stages: **anonymous → photos → consent form → ID verify → booking/address**. No addresses or contact info until **photos + signed consent + verification** (see trust ladder in product copy).

### Core principles

1. Anonymous until consent.  
2. Consent unlocks identity (progressive).  
3. Every industry (categories/tags).  
4. Local / geo-bounded markets.  
5. Consensual, structural gates.  
6. Safety is the product.

### Stack

Next.js 14+ (App Router), TypeScript, Tailwind, Supabase (Postgres, PostGIS, Auth, Realtime, Storage), Persona, Checkr (providers), Stripe Connect, Resend, Twilio, Vercel.

### Schema highlights (implemented in migrations)

- **`users`**: `email`, `alias`, `role` (`seeker` | `provider` | `both` | `admin`), profile + metro + verification **flags only** — no PII columns after `20260330120100`.
- **`user_pii`**: `BYTEA` columns for ciphertext (first/last name, DOB, selfie ref, phone). Encrypt/decrypt in app with `ENCRYPTION_KEY` (see `src/lib/encryption.ts`).
- **`connections`**: `stage` enum (full ladder including `photos_requested`, `consent_pending`, … `expired`).
- **`provider_locations`**, **`consent_forms`**, **`bookings`**, **`messages`**, **`reviews`**, **`reports`**, **`markets`** — see `20260330120000_initial_schema.sql`.

### RLS

`20260330120200_rls_policies.sql` — policies for `users`, `user_pii`, `provider_profiles`, `connections`, `messages`, `bookings`, `reviews`. **Requires** `users.id` = `auth.users.id`. Adjust if you use a separate `public.profiles` mapping.

### API & pages

See your master spec for the full route list (`/explore`, `/connections/[id]`, `/api/connections/...`, etc.). Implement incrementally; **always** gate responses with `validateStageForAction` and decrypt `user_pii` only on the server.

### Cursor kickoff (short)

1. Read **SPEC.md** and `supabase/migrations/*.sql`.  
2. Wire Supabase Auth; ensure new users get a `users` row with `id = auth.uid()`.  
3. Never return `user_pii` blobs to the client; decrypt only server-side.  
4. Run `moderateMessage()` before persisting chat in anonymous stages.  
5. Enforce `canTransition()` on any `connections.stage` update.  
6. Extend UI from `/design-system` tokens (Tailwind + `globals.css`).

---

## Part 2 — Go-to-market (summary)

**Positioning:** Only combined offering of anonymity + multi-industry services + trust ladder + verification + local marketplace + payments.

**Model:** ~15% platform fee on sessions; provider-paid BG check; deposits per your policy.

**Launch:** Supply-first (providers), 1–2 metros; legal/compliance (FOSTA-SESTA, licensing) before scale.

---

## Part 3 — Working prototype (JSX)

The **full** single-file React prototype (landing, onboarding, marketplace, connection thread, trust ladder UI, bookings, provider dashboard) should be **ported** into this repo as a client route or Storybook. **Source:** your master SPEC document (Part 3 code block).

Suggested path after port: `src/app/prototype/page.tsx` (dynamic import, `"use client"`).

---

## Part 4 — Design system

**Implemented:** `http://localhost:3000/design-system` — tokens, components, trust ladder strip, messaging samples.

**Reference JSX** from the master doc Part 4 is superseded by `DesignSystemShowcase.tsx` + `tokens.ts` (uses `next/font`, not inline Google `@import`).

---

## Critical rules (non-negotiable)

1. No real names / verified selfies / addresses / phones in UI until stage allows it.  
2. Every user-data API checks connection stage and strips PII.  
3. Encrypt PII at rest; Persona holds ID images — store only status + inquiry id on `users`.  
4. Moderate anonymous messages (`src/lib/moderation.ts`).  
5. Geo-gate provider browse.  
6. 18+ at signup and verification.  
7. Signed consent before booking.  
8. Providers only for Checkr.  
9. Reviews anonymous by default.  
10. Platform is **not** for sexual services — ToS + moderation.

---

## Data minimization (see master spec)

Messages auto-expire, consent notes TTL, hard delete on account closure, minimal logs, Stripe holds payment artifacts — **implement in later migrations/cron**; this repo includes schema + RLS + crypto utilities as foundation.

---

*End of SPEC.md — extend this file or add `docs/SPEC_APPENDIX.md` if you need the full pasted markdown from the master document in-repo.*
