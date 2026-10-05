import { ArrowDown, ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { Reveal } from "./reveal";
import { WaitlistForm } from "./waitlist-form";
import { FaqAccordion } from "./faq-accordion";
import { TierCta } from "./tier-cta";
import { PrivacyLink } from "./privacy-sheet";

/* ─────────────────────────────────────────────
   Shared bits
   ───────────────────────────────────────────── */

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-[22px] tracking-[0.32em] ${className}`}
      aria-hidden="true"
    >
      LYRIA<span className="text-gold">.</span>
    </span>
  );
}

/* ─────────────────────────────────────────────
   1 · Announcement bar  (client's honesty line)
   ───────────────────────────────────────────── */

export function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2 text-center">
      <p className="flex items-center justify-center gap-2.5 text-[10.5px] text-cream-muted sm:text-[11px]">
        <span
          className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-gold-soft"
          aria-hidden="true"
        />
        <span className="eyebrow text-cream-muted">{site.statusBadge}</span>
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2 · Sticky nav
   ───────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#tiers", label: "Membership" },
  { href: "#doctor", label: "About" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-paper focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
    >
      Skip to content
    </a>
  );
}

export function Header() {
  return (
    <>
      <Nav />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="#main"
            aria-label="Lyria — back to top"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <Wordmark className="text-paper" />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav-link text-[13px] font-medium text-paper/90 transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#waitlist"
            className="rounded-sm bg-paper px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Join the waitlist
          </a>
        </div>
      </header>
    </>
  );
}

/* ─────────────────────────────────────────────
   3 · Hero — dark ink, glow + contour, form card
   ───────────────────────────────────────────── */

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper" aria-labelledby="hero-title">
      {/* ambience */}
      <div
        className="animate-drift pointer-events-none absolute -right-40 -top-48 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(169,130,61,0.22)_0%,rgba(169,130,61,0.06)_45%,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="contour pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Copy column */}
          <div>
            <Reveal>
              <p className="flex items-center gap-2.5 text-cream-muted">
                <span
                  className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-gold-soft"
                  aria-hidden="true"
                />
                <span className="eyebrow text-cream-muted">{site.statusBadge}</span>
              </p>
            </Reveal>

            <Reveal delay={90}>
              <h1
                id="hero-title"
                className="font-display mt-7 text-[clamp(2.9rem,7.5vw,5.6rem)] font-light leading-[1.04] tracking-[-0.015em]"
              >
                {site.hero.titleA}
                <br />
                <em className="font-normal italic text-gold-soft">
                  {site.hero.titleB}
                </em>{" "}
                {site.hero.titleC}
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-7 max-w-xl text-[15.5px] leading-relaxed text-cream-muted sm:text-base">
                {site.hero.sub}
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a
                  href="#tiers"
                  className="group inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:text-gold-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                >
                  {site.hero.secondaryCta}
                  <ArrowDown
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
                <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />
                <span className="text-[13px] text-cream-muted">
                  No payment details · No health questions
                </span>
              </div>
            </Reveal>
          </div>

          {/* Form column — the one clear action */}
          <Reveal delay={200} className="lg:sticky lg:top-28">
            <WaitlistForm source="hero" idPrefix="hero" />
          </Reveal>
        </div>

        {/* Stat band — the honest comparison */}
        <Reveal delay={120}>
          <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 sm:mt-20 sm:grid-cols-2 sm:gap-6 lg:mt-24">
            <div>
              <p className="eyebrow text-cream-muted">{site.stat.eyebrow}</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-5xl font-light text-paper sm:text-6xl">
                  {site.stat.nhsValue}
                </span>
                <span className="font-display text-xl italic text-paper/80">
                  {site.stat.nhsUnit}
                </span>
              </p>
              <p className="mt-2 text-[13px] text-cream-muted">{site.stat.nhsNote}</p>
            </div>
            <div className="sm:border-l sm:border-white/10 sm:pl-6">
              <p className="eyebrow text-gold-soft">{site.stat.lyriaLabel}</p>
              <p className="font-display mt-3 text-3xl font-light italic text-gold-soft sm:text-4xl">
                {site.stat.lyriaValue} {site.stat.lyriaValue2}
              </p>
              <p className="mt-2 text-[13px] text-cream-muted">
                Target at launch — not yet a live service.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   4 · How it works
   ───────────────────────────────────────────── */

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-paper" aria-labelledby="how-title">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow text-[#8a6524]">{site.howItWorks.eyebrow}</p>
          <h2
            id="how-title"
            className="font-display mt-4 max-w-2xl text-4xl font-light tracking-[-0.01em] text-ink sm:text-5xl"
          >
            {site.howItWorks.title}
          </h2>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
            {site.howItWorks.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {site.howItWorks.steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 120}>
              <div className="border-t border-line pt-7">
                <p className="font-display text-5xl font-light italic text-[#8a6524]">
                  {step.num}
                </p>
                <h3 className="font-display mt-5 text-2xl font-normal text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   5 · Pull quote — the client's insight
   ───────────────────────────────────────────── */

export function QuoteBand() {
  return (
    <section className="border-y border-line bg-paper-raised" aria-label="Why Lyria exists">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
        <Reveal>
          <span
            className="font-display block text-7xl leading-none text-gold-soft"
            aria-hidden="true"
          >
            “
          </span>
          <blockquote className="font-display mt-2 text-2xl font-light italic leading-snug text-ink sm:text-[2.1rem]">
            {site.quote.text}
          </blockquote>
          <p className="eyebrow mt-8 text-[#8a6524]">
            — {site.quote.attribution}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   6 · Membership tiers
   ───────────────────────────────────────────── */

export function Tiers() {
  return (
    <section id="tiers" className="scroll-mt-20 bg-paper" aria-labelledby="tiers-title">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="eyebrow text-[#8a6524]">{site.tiers.eyebrow}</p>
          <h2
            id="tiers-title"
            className="font-display mt-4 max-w-2xl text-4xl font-light tracking-[-0.01em] text-ink sm:text-5xl"
          >
            {site.tiers.title}
          </h2>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
            {site.tiers.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {site.tiers.plans.map((plan, i) => {
            const featured = plan.id === "plus";
            return (
              <Reveal key={plan.id} delay={i * 120} className="h-full">
                <article
                  className={`flex h-full flex-col rounded-md border p-7 sm:p-8 ${
                    featured
                      ? "border-ink bg-ink text-paper shadow-[0_32px_64px_-32px_rgba(27,44,71,0.55)]"
                      : "border-line bg-paper-raised text-ink"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={`eyebrow ${
                        featured ? "text-gold-soft" : "text-ink-soft"
                      }`}
                    >
                      {plan.visits} {plan.visitsLabel}
                    </p>
                    <span
                      className={`eyebrow rounded-full border px-2.5 py-1 text-[9px] ${
                        featured
                          ? "border-gold-soft/50 text-gold-soft"
                          : "border-[#8a6524]/40 text-[#8a6524]"
                      }`}
                    >
                      Planned
                    </span>
                  </div>

                  <h3 className="font-display mt-6 text-3xl font-light">
                    {plan.name}
                  </h3>
                  <p
                    className={`font-display mt-1.5 text-[15px] italic ${
                      featured ? "text-gold-soft" : "text-[#8a6524]"
                    }`}
                  >
                    {plan.tagline}
                  </p>

                  <p
                    className={`mt-4 text-[14px] leading-relaxed ${
                      featured ? "text-cream-muted" : "text-ink-soft"
                    }`}
                  >
                    {plan.body}
                  </p>

                  <ul
                    className={`mt-6 space-y-2.5 border-t pt-6 text-[13.5px] ${
                      featured ? "border-white/10" : "border-line"
                    }`}
                  >
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <span
                          className="mt-[9px] inline-block h-px w-3 shrink-0 bg-gold"
                          aria-hidden="true"
                        />
                        <span className={featured ? "text-paper/90" : "text-ink-soft"}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <p className="flex items-baseline gap-2">
                      <span className="font-display text-5xl font-light">
                        {plan.price}
                      </span>
                      <span
                        className={`text-[13px] ${
                          featured ? "text-cream-muted" : "text-ink-soft"
                        }`}
                      >
                        per month · provisional
                      </span>
                    </p>
                    <div className="mt-5">
                      <TierCta tierId={plan.id} featured={featured} />
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={150}>
          <p className="eyebrow mt-10 text-center text-ink-soft">{site.tiers.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   7 · Doctor / clinical governance
   ───────────────────────────────────────────── */

export function Doctor() {
  return (
    <section
      id="doctor"
      className="scroll-mt-20 border-t border-line bg-paper"
      aria-labelledby="doctor-title"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow text-[#8a6524]">{site.doctor.eyebrow}</p>
            <h2
              id="doctor-title"
              className="font-display mt-4 text-4xl font-light tracking-[-0.01em] text-ink sm:text-5xl"
            >
              {site.doctor.title}
            </h2>
            <p className="eyebrow mt-5 text-ink-soft">{site.doctor.credential}</p>
            <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
              {site.doctor.body1}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="flex h-full flex-col justify-between rounded-md border border-line bg-paper-raised p-8 sm:p-10">
              <p className="font-display text-2xl font-light italic leading-snug text-ink sm:text-[1.7rem]">
                “…{site.doctor.pullLine}”
              </p>
              <div className="mt-10 border-t border-line pt-6">
                <p className="text-[14px] leading-relaxed text-ink-soft">
                  {site.doctor.body2}
                </p>
                <p className="eyebrow mt-5 text-[#8a6524]">
                  CQC registration in progress
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   8 · FAQ
   ───────────────────────────────────────────── */

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-paper" aria-labelledby="faq-title">
      <div className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-[#8a6524]">{site.faq.eyebrow}</p>
              <h2
                id="faq-title"
                className="font-display mt-4 text-4xl font-light tracking-[-0.01em] text-ink sm:text-5xl"
              >
                {site.faq.title}
              </h2>
              <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-ink-soft">
                Anything else? Email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="underline underline-offset-2 hover:text-ink"
                >
                  {site.email}
                </a>{" "}
                — a person replies.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <FaqAccordion />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   9 · Final CTA + footer  (dark ink close)
   ───────────────────────────────────────────── */

export function FinalCta() {
  return (
    <section
      id="waitlist"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/10 bg-ink text-paper"
      aria-labelledby="waitlist-title"
    >
      <div className="contour pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-48 top-1/3 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(169,130,61,0.16)_0%,transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-xl text-center">
          <Reveal>
            <p className="eyebrow text-gold-soft">Waiting list</p>
            <h2
              id="waitlist-title"
              className="font-display mt-4 text-4xl font-light tracking-[-0.01em] sm:text-5xl"
            >
              {site.finalCta.title}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-cream-muted">
              {site.finalCta.intro}
            </p>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div className="mx-auto mt-12 max-w-xl">
            <WaitlistForm source="footer" idPrefix="footer" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="text-paper" />
            <p className="font-display mt-3 text-[15px] italic text-cream-muted">
              {site.hero.tagline}
            </p>
            <p className="eyebrow mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-cream-muted">
              <span
                className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-gold-soft"
                aria-hidden="true"
              />
              {site.statusBadge}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-gold-soft">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13.5px] text-cream-muted transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-gold-soft">Contact &amp; legal</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-cream-muted">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <PrivacyLink className="underline underline-offset-2 transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                  Privacy Notice
                </PrivacyLink>
              </li>
              <li>Consent wording v1.0</li>
              <li>{site.legalName}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="max-w-4xl text-[11.5px] leading-relaxed text-cream-muted/80">
            {site.footer.cqcDisclaimer}
          </p>
          <p className="mt-4 max-w-4xl text-[11.5px] leading-relaxed text-cream-muted/80">
            {site.footer.companyLine}
          </p>
          <p className="mt-6 text-[11.5px] text-cream-muted/60">
            © {site.year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
