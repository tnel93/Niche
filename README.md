# niche

Anonymous, consent-gated marketplace for kink-aware professional services.

**Product + engineering index:** [SPEC.md](./SPEC.md) (points to migrations, `src/lib/*`, and design system).

## Design system

Run the app and open `/design-system` for the full token and component reference (matches the NICHE build spec).

```bash
npm install
npm run dev
```

Product pages use the same Tailwind theme in `tailwind.config.ts` and CSS variables in `src/app/globals.css`.

## Database

Initial Postgres + PostGIS schema and seed data live in `supabase/migrations/`. Connection stages follow the **five-stage trust ladder** (anonymous → photos → consent → ID verify → booking/address). Copy `.env.example` to `.env.local` for integration keys.
