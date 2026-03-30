import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-brand text-5xl font-extrabold tracking-tight text-terra">
          niche
        </p>
        <p className="mt-2 text-sm font-bold uppercase tracking-widest text-espresso-muted">
          find your thing
        </p>
        <p className="mt-8 text-md leading-relaxed text-espresso-soft">
          Anonymous, consent-gated marketplace for kink-aware professional
          services. Design system and product UI use the same tokens.
        </p>
        <Link
          href="/design-system"
          className="mt-10 inline-flex rounded-lg bg-terra px-7 py-4 text-base font-bold tracking-wide text-white shadow-glow transition-all duration-base hover:-translate-y-0.5 hover:bg-terra-hover"
        >
          Open design system
        </Link>
      </div>
    </main>
  );
}
