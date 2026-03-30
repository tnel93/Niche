# Niche prototype (Part 3)

The **full working prototype** from the build spec lives in **[`PROTOTYPE.jsx`](./PROTOTYPE.jsx)** — landing, onboarding gate, marketplace, provider profile, connection thread with trust ladder, connections list, bookings, and provider dashboard.

**To run it in Next.js:**

1. Create `src/app/prototype/page.tsx` with `"use client"`.
2. Copy the component tree from `docs/PROTOTYPE.jsx` (or dynamically import after renaming to `.tsx` and fixing types).
3. Optionally align fonts with `layout.tsx` (`next/font`) instead of the file’s Google `@import` in `<style>`.

Until ported, use **`/design-system`** for the token gallery and **`SPEC.md`** for product rules.
