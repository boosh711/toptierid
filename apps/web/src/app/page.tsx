import Link from "next/link";
import { Logo } from "@/components/logo";
import { PRICING, BRAND } from "@top-tier-id/types";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo />
          <nav className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-secondary text-sm">
              Log in
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 py-24">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 font-display text-sm uppercase tracking-[0.25em] text-brand-light">
            Girls&apos; Soccer · Recruiting
          </p>
          <h1 className="font-display text-4xl uppercase leading-tight tracking-wide md:text-5xl">
            Your Digital ID.
            <br />
            Direct to Coaches.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            {BRAND.tagline} Build a customizable profile with highlights, schedule, and
            college goals — share one link. Coaches search, scout, and sync games to their
            calendar. Free for coaches. Always.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup?role=athlete" className="btn-primary px-8 py-3 text-base">
              Build your profile
            </Link>
            <Link href="/auth/signup?role=coach" className="btn-coach">
              I&apos;m a coach
            </Link>
            <Link href="/auth/demo" className="text-sm text-muted underline hover:text-brand-light">
              Try demo accounts
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="section-heading mb-10 justify-center">Simple pricing</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { ...PRICING.athleteFree, features: ["Basic profile", "1 reel", "Aggregate coach interest"] },
            { ...PRICING.athletePremium, features: ["Unlimited reels", "See which coaches viewed", "Priority placement", "Custom URL"], highlight: true },
            { ...PRICING.coach, features: ["Search & filters", "Voice notes", "Calendar sync", "Personal notes"] },
            { ...PRICING.program, features: ["Staff workspace", "Multi-coach CRM", "Conflict alerts", "Analytics"] },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`card ${"highlight" in tier && tier.highlight ? "border-brand ring-1 ring-brand/50" : ""}`}
            >
              <h3 className="font-semibold text-white">{tier.name}</h3>
              <p className="mt-2 font-display text-2xl text-brand-light">
                {tier.price}
                <span className="text-sm font-sans text-muted">{tier.period}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {tier.features.map((f) => (
                  <li key={f}>
                    <span className="text-brand-light">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          {[
            { title: "Athletes", desc: "One link for your brand — stats, reels, schedule, goals." },
            { title: "Coaches", desc: "Search, voice notes from the sideline, calendar sync to iPhone." },
            { title: "Parents", desc: "Supervisory view of profile, messages, and premium status." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="font-display text-lg uppercase tracking-wide text-brand-light">{item.title}</h3>
              <p className="mt-2 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} TOP TIER ID · toptierid.com
      </footer>
    </div>
  );
}
