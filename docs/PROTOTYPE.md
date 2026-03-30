# Niche prototype (Part 3)

The **full working prototype** from the master build spec is a large single-file JSX app (landing → onboarding → marketplace → profile → connection + trust ladder → bookings → provider dashboard).

**To add it here:**

1. Create `src/app/prototype/page.tsx` with `"use client"`.
2. Paste the Part 3 `export default function App()` component from your SPEC.
3. Replace inline `T.font` strings with CSS variables if you want font parity with `layout.tsx` (`var(--font-fraunces)`, etc.), or keep the spec’s `@import` in a `<style>` tag for a self-contained demo.
4. Add a link from `/` or the nav: “Open prototype”.

Until ported, use **`/design-system`** for visual reference and **`/explore`** (when built) for production routes.
