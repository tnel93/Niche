# NICHE — Complete Business Plan

## The whole thing: model, app, marketing, operations, launch sequence

---

## BUSINESS MODEL

### Revenue Streams

**Stream 1 — Niche Pass (subscription): $19.99/month**

- Free users can browse provider cards (alias, category, tags, rating, distance, rate range)
- Niche Pass unlocks: messaging, trust ladder, photo exchange, consent forms, booking
- This is the primary revenue engine
- Auto-renews monthly via Stripe
- Cancel anytime, access drops to browse-only immediately

**Stream 2 — Booking fee: 5% charged to seeker**

- Added on top of provider's rate at checkout
- Provider charges $100 → seeker pays $105 → provider gets $100, platform gets $5
- Provider never feels the fee. Seeker barely notices it.
- Secondary revenue stream, scales with transaction volume

**Stream 3 — Featured Provider (future, NOT at launch): $29/month**

- Boosted placement in search results
- "Featured" badge on profile card
- Analytics dashboard (profile views, message rate, booking conversion)
- Only introduce once marketplace has 100+ providers and free tier feels crowded
- This is month 6+ revenue, don't build it now

### Provider Economics: Completely Free

- $0 to sign up
- $0 monthly
- $0 commission on sessions
- They keep 100% of their session rate
- They set their own prices
- The pitch: "Free to join, keep everything you earn, get clients you can't find anywhere else"

### Seeker Economics

- Free to browse (see what's available, get hooked)
- $19.99/month to connect (message, trust ladder, book)
- 5% booking fee at checkout
- Average seeker spends: $19.99 + ~$5-10/booking × 2-3 bookings/month = $30-50/month

### Unit Economics

```
Per paying subscriber per month:
  Subscription:                 $19.99
  Avg booking fees (2.5 sessions × $5.50):  $13.75
  Gross revenue per subscriber: $33.74
  Stripe processing (~3%):     -$1.01
  Net revenue per subscriber:   $32.73

Infrastructure cost per subscriber (at scale):
  Supabase (prorated):          ~$0.15
  Vercel (prorated):            ~$0.05
  Twilio (2-3 SMS/mo):         ~$0.10
  Total cost per subscriber:    ~$0.30

Contribution margin per subscriber: $32.43 (96%)
```

### Breakeven

```
Fixed monthly costs (launch):
  Domain:           $1/mo (amortized)
  Supabase:         $0 (free tier to start)
  Vercel:           $0 (free tier)
  Twilio:           ~$5/mo
  Resend:           $0 (free tier)
  Total fixed:      ~$6/mo

Breakeven: 1 paying subscriber
Cash flow positive from subscriber #1
```

---

## THE APP — WHAT TO BUILD AND IN WHAT ORDER

### Week 1: Waitlist Landing Page (deploy immediately)

Build and ship before the app is done. This validates demand and builds an email list.

**Page contents:**

- Hero: "niche — find your thing"
- One-liner: "Anonymous marketplace for fetish-aware services. Every industry. Verified. Consensual."
- How it works (5-stage trust ladder visual)
- Category grid showing breadth (barber, dentist, trainer, tailor, etc.)
- Two email capture forms:
  - "I'm looking for services" (seeker waitlist)
  - "I'm a provider" (provider waitlist)
- Trust badges (anonymous, verified, consent-first, encrypted)
- FAQ section (what is this, is it legal, is it safe, how does anonymity work)
- Footer: "niche is operated by [LLC name]. 18+ only."

**Tech:** Single HTML page on Vercel. Email capture via Supabase (just an email + type column in a waitlist table). No paid tools needed.

**Domain:** Buy something clean. Options: getniche.app, nicheconnect.co, findyourniche.app, meetniche.com. Check availability and grab whatever works. Budget: $12.

### Week 2-3: Core App (MVP)

Use the NICHE-COMPLETE-SPEC.md in Cursor. Build only what's needed for first bookings:

**Must build (MVP):**

- Signup / login (Supabase Auth, email + password)
- Alias creation + age verification (DOB check, 18+)
- Metro area selection
- Interest tag selection
- Provider profile creation (category, bio, tags, boundaries, rate, availability)
- Marketplace browse (filter by category, tags, search, distance)
- Provider profile pages (anonymous)
- Free browse vs. paid connection paywall (Stripe subscription checkout)
- Messaging (Supabase Realtime)
- Message auto-moderation (PII regex blocking)
- Trust ladder stage management (all 5 stages functional)
- Photo exchange flow (Stage 2)
- Consent form builder (Stage 3)
- Manual ID verification (Stage 4 — photo upload, NOT Persona yet)
- Booking flow with payment (Stage 5 — Stripe checkout, 5% fee added)
- Connection and booking list views

**Do NOT build yet (defer to month 2+):**

- Provider dashboard with analytics
- Persona integration (manual review is fine at low volume)
- Checkr background checks (self-certification at launch)
- Stripe Connect (use simple Stripe payments, manual provider payouts)
- Admin dashboard (use Supabase dashboard directly)
- Review system (add after first 20 completed sessions)
- Push notifications (email only at launch)
- SMS notifications beyond verification

### Week 4: Internal Testing

- You + your barber + 3-5 trusted people test every flow
- Create 5 real provider profiles (your barber, anyone she can recruit)
- Create 3 test seeker accounts
- Run through complete trust ladder end-to-end
- Fix bugs, polish UX, verify paywall works

### Week 5: Soft Launch

- Email the waitlist: "niche is live. You're in first."
- Providers go live
- Seekers can browse free, subscribe to connect
- Monitor everything manually for the first 2 weeks
- Respond to issues within hours (via support@getniche.app)

---

## BRAND & COMMUNICATIONS

### Brand Identity (faceless)

- **Name:** niche
- **Tagline:** "find your thing"
- **Voice:** Warm, confident, playful, discreet. Like a trusted friend who doesn't judge.
- **Never:** Clinical, preachy, edgy, dark, try-hard, corporate
- **Visual:** Warm cream + terracotta. Fraunces serif + DM Sans. (Full design system in the spec)

### The Brand is Faceless

- No founder story. No "meet the team." No headshots.
- All communications come from "the niche team" or just "niche"
- Support email: support@getniche.app (you reply as "niche team")
- Social accounts are brand-only, no personal accounts connected
- LLC name on legal pages only, not on marketing

### Communication Channels

**Email (primary — where you control the relationship):**

- Waitlist updates: "We're building. Here's what's coming."
- Launch announcement: "You're in."
- Weekly digest (once you have volume): "New providers this week" / "Popular in your area"
- Booking confirmations + reminders
- Post-session check-in prompts
- All emails faceless, from niche team, warm tone, short

**Social Media (secondary — for discovery, not engagement):**

- Create: Instagram + Twitter/X + TikTok accounts for @getniche or @findyourniche
- Content strategy: educational + awareness, NOT thirst traps or explicit content
  - "What is a fetish-aware barber?" (educational)
  - "Why consent frameworks matter in personal services" (thought leadership)
  - "5 fetishes you didn't know were this common" (curiosity hooks)
  - Anonymous provider spotlights: "Meet SteadyHands_303, a barber on niche" (alias only, no face)
  - Trust/safety content: "How niche keeps you anonymous" (builds confidence)
- Post frequency: 3-4x/week, batched and scheduled via Buffer or Later (free tier)
- All content can be AI-generated. Write prompts, schedule, let it run.
- NEVER post explicit content. Keep it PG-13. The app is for adults but the marketing is tasteful.

**Reddit (critical — this is where your users already are):**

- DO NOT spam subreddits. This will get you banned and damage the brand.
- Strategy: become a genuine participant in relevant communities FIRST
  - r/BDSMcommunity, r/fetish, r/kink, r/sex, r/sexpositive
  - Comment helpfully on posts about finding kink-aware providers
  - After building genuine karma, share niche organically: "I found this platform that does X"
  - Use a brand account, not your personal account
- Also post in local subreddits when you launch in a metro: r/Denver, r/Austin, etc.
- Reddit is slow but compounds. One good post can drive hundreds of signups.

**FetLife (essential — this is THE community):**

- Create a niche group/page on FetLife
- FetLife doesn't allow ads, so you must participate genuinely
- Post in relevant groups: "We built a platform for [X], looking for early providers and feedback"
- Be transparent about what it is and what it isn't
- This is your #1 provider acquisition channel
- Your barber should post in her FetLife networks if she's willing

**SEO / Content (long game, start immediately):**

- Blog on the niche website: getniche.app/blog
- Target zero-competition keywords:
  - "fetish aware barber near me"
  - "kink friendly massage therapist"
  - "how to find a fetish friendly dentist"
  - "fetish services marketplace"
  - "anonymous kink provider platform"
  - "consent framework for personal services"
- Each blog post targets one long-tail keyword
- AI-generate 2-3 posts per week (Claude can write these)
- This is a 3-6 month play but it's free and compounds forever
- Nobody is competing for these keywords. You'll rank fast.

---

## PROVIDER ACQUISITION (the critical problem)

You need providers before seekers have anyone to browse. Here's the playbook:

### Phase 1: Seed Providers (Week 1-4) — Target: 15-25

**Your barber is recruiter #1, not a partner.**

- Ask her to personally invite 5-10 people she knows in the community
- Give her a specific pitch she can forward:
  "I'm joining a new platform called niche — it's a free, anonymous marketplace where clients with specific interests find willing providers. You keep 100% of your rate, your real identity is hidden until you choose to share it, and every client is verified. It's launching in Denver. Want in?"
- That's it. She sends a text or DM to 10 people. 3-5 will sign up.

**FetLife outreach (you, as the brand):**

- Search FetLife for professionals who already identify as kink-aware
- Barbers, massage therapists, estheticians, trainers, bodyworkers, etc.
- Direct message them (as niche, not as Tyler):
  "Hey — we're launching niche, a free marketplace where kink-aware service providers connect with verified clients. You set your own rates, keep 100%, and your identity stays anonymous until you choose to reveal it. Would you be interested in an early provider profile? Launching in [city] this month."
- Send 10 of these per day. Expect 20-30% response rate, 10-15% conversion.

**KAP Directory mining:**

- The Kink Aware Professionals directory lists real professionals
- Many are therapists/lawyers but some are bodyworkers, massage therapists, etc.
- Email them the same pitch (slightly more formal)

**Local kink event networking (your barber does this, not you):**

- Denver has kink munches, workshops, events
- Your barber or early providers spread the word at these events
- Business cards with just: "niche — find your thing — getniche.app"
- No explicit language on the card. Curious people will visit the site.

### Phase 2: Organic Provider Growth (Month 2+)

- Every booking that goes well → provider tells other providers
- Provider referral program: "Invite a provider, you both get featured placement for a month"
- SEO brings in providers searching for "how to find fetish clients" or "kink aware provider marketplace"
- Repeat FetLife outreach in new metros as you expand

---

## SEEKER ACQUISITION

### Phase 1: Waitlist Conversion (Week 5)

- Email everyone on the waitlist: "niche is live in Denver. You're in first."
- Free browse converts to paid subscriptions when seekers see providers they want to connect with
- The paywall is the conversion tool — they can see what exists but can't touch it without subscribing

### Phase 2: Organic Discovery (Ongoing)

- SEO blog posts drive Google traffic
- Reddit participation drives community traffic
- FetLife group grows through word of mouth
- Social media drives curiosity traffic
- Every satisfied seeker tells their community — fetish networks are tight-knit

### Phase 3: Content Loop (Month 2+)

- "New providers this week" email to all free users → drives subscription conversion
- Provider spotlight posts on social → drives site visits
- Blog content ranks on Google → drives organic signups
- This loop runs on autopilot once content templates are built

---

## OPERATIONS (what you actually do week to week)

### Daily (15 minutes max)

- Check support@getniche.app for any issues (Resend inbox)
- Review any pending ID verifications (manual photo review at launch)
- Glance at Supabase dashboard for any flagged reports

### Weekly (1 hour)

- Process provider payouts (manual Stripe transfers until you add Connect)
- Review any reports/flags
- Schedule 3-4 social media posts (AI-generated, batched)
- Send 1 email to subscriber list (new providers, platform updates)
- Check Stripe dashboard for revenue + churn

### Monthly (2 hours)

- Review metrics: subscribers, bookings, revenue, churn rate
- Write/generate 4-8 SEO blog posts (batch and schedule)
- FetLife outreach: 20 new provider DMs
- Decide if it's time to add any deferred features

### Quarterly

- Evaluate: add Persona? Add Stripe Connect? Add Checkr? Add new metro?
- Each decision gated by revenue: "Can revenue absorb this cost?"

---

## LAUNCH SEQUENCE (exact timeline)

### Day 1-2: Foundation

- [ ] Register LLC (if not using existing one)
- [ ] Buy domain
- [ ] Set up email: support@getniche.app (Resend or Google Workspace)
- [ ] Create brand social accounts (Instagram, X, TikTok) — faceless, logo only
- [ ] Set up Stripe account
- [ ] Set up Supabase project

### Day 3-5: Waitlist

- [ ] Build and deploy landing page on Vercel
- [ ] Set up waitlist email capture (Supabase table)
- [ ] Write and schedule first 5 social media posts
- [ ] Post in 3-5 FetLife groups (as brand) announcing the waitlist
- [ ] Post in 2-3 relevant subreddits (carefully, following community rules)
- [ ] Ask your barber to share the waitlist link with her network
- [ ] Start sending FetLife DMs to potential providers (10/day)

### Day 5-20: Build the App

- [ ] Feed NICHE-COMPLETE-SPEC.md to Cursor
- [ ] Build Phase 1-3 from the spec (auth, profiles, marketplace, messaging)
- [ ] Build trust ladder (5 stages, all functional)
- [ ] Build Stripe subscription paywall (Niche Pass)
- [ ] Build booking flow with 5% fee
- [ ] Manual ID verification (file upload, you review)
- [ ] Test everything

### Day 20-25: Seed Supply

- [ ] Confirm 10-15 provider profiles are live
- [ ] Verify each provider's profile looks good (bio, tags, rate, availability)
- [ ] Test the full trust ladder with 2-3 test bookings end-to-end
- [ ] Fix any issues found in testing

### Day 25-28: Pre-Launch

- [ ] Write launch email for waitlist
- [ ] Prepare "we're live" social posts
- [ ] Set up basic monitoring (Stripe webhook alerts, Supabase error logging)
- [ ] Final QA pass on all flows

### Day 30: Launch

- [ ] Send waitlist email: "niche is live"
- [ ] Post on all social channels
- [ ] Post on FetLife
- [ ] Post on relevant subreddits
- [ ] Monitor for the first 48 hours actively

### Day 30-60: Iterate

- [ ] Watch what breaks, fix it fast
- [ ] Watch what converts, double down on it
- [ ] Respond to every support email same-day
- [ ] Continue FetLife provider outreach (10 DMs/day)
- [ ] Continue SEO content (2 posts/week)
- [ ] Track: waitlist signups → free accounts → paid subscribers → bookings

---

## METRICS THAT MATTER

Track these weekly. Nothing else matters at launch.

```
Waitlist signups          → Are people interested?
Free account creations    → Are they signing up?
Browse-to-subscribe rate  → Are they willing to pay?
Subscriber count (MRR)    → How much recurring revenue?
Messages sent per day     → Is the platform active?
Trust ladder progression  → Are people advancing through stages?
Bookings completed        → Are real sessions happening?
Subscriber churn rate     → Are they staying?
Provider count            → Is supply growing?
```

### Milestones

```
Milestone 1:  100 waitlist signups        → Demand signal confirmed
Milestone 2:  15 live providers           → Supply exists
Milestone 3:  10 paying subscribers       → Revenue started ($200/mo)
Milestone 4:  First completed booking     → Product works
Milestone 5:  50 paying subscribers       → $1K MRR
Milestone 6:  100 paying subscribers      → $2K MRR, consider Persona/Connect
Milestone 7:  25 completed bookings/mo    → Marketplace has liquidity
Milestone 8:  $5K MRR                     → Second metro, premium features
```

---

## RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Stripe shuts down account | Medium | High | Keep category description clean ("personal services marketplace"), no explicit language in transaction descriptions. Have backup processor researched (Square, PayPal). |
| FOSTA-SESTA legal challenge | Low | High | LLC shields personal liability. ToS explicitly prohibits sexual services. Platform facilitates legitimate professional services. Get legal consult at $2K MRR. |
| Provider supply too thin | Medium | High | Don't launch to seekers until 15+ providers exist. Barber network + FetLife outreach. Free for providers removes all friction. |
| Seekers take relationships off-platform | High | Medium | Trust ladder features (consent forms, verification, reviews, safety) only exist on-platform. Emphasize safety value in messaging. |
| Fake/bad actor providers | Medium | High | Manual ID review at launch. Add Checkr at scale. Report system. Session check-in timers. |
| Low conversion from free to paid | Medium | Medium | Make the browse experience compelling enough that seeing providers you want to connect with creates urgency. "New providers" emails to free users drive conversion. |
| Churn after first booking | High | Medium | Value isn't just discovery — it's ongoing safety, consent framework, and new provider access. Highlight this in retention emails. |

---

## WHAT SUCCESS LOOKS LIKE

**Month 1:** 15 providers, 50 seekers, 10 subscribers, $200 MRR, 3-5 bookings

**Month 3:** 30 providers, 200 seekers, 60 subscribers, $1,200 MRR, 20 bookings/month

**Month 6:** 75 providers, 600 seekers, 180 subscribers, $3,600 MRR, 50 bookings/month

**Month 12:** 200 providers across 2-3 metros, 2,000 seekers, 500 subscribers, $10K MRR

At $10K MRR you have a real business that runs on ~2 hours/week of your time, with optionality to raise capital, expand aggressively, or just let it compound.

---

## THE ONE THING THAT MAKES OR BREAKS THIS

It's not the app. It's not the pricing. It's not the marketing.

It's the first 15 providers.

If you have 15 real, quality providers with good profiles live in Denver when you email the waitlist, this works. If you have 4 providers with half-filled profiles, seekers show up, see nothing interesting, and never come back.

Your barber's network is the unlock. She doesn't need to be a partner or co-founder. She needs to text 15 people a link and say "this is legit, sign up." That's it. Everything else — the app, the marketing, the operations — is built around making those 15 providers discoverable, trustworthy, and bookable.

Get the 15. Everything else follows.
