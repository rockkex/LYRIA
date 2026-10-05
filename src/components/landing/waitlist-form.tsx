"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle, Undo2 } from "lucide-react";
import { site, tierIds } from "@/content/site";
import { EmailPreviewDialog } from "./email-preview-dialog";
import { PrivacyLink } from "./privacy-sheet";

type FormState = "idle" | "submitting" | "success" | "already" | "error";

interface WaitlistFormProps {
  /** Consent source logged in the audit trail: "hero" | "footer" */
  source: "hero" | "footer";
  /** footer variant renders dark-section styling (still a cream card) */
  variant?: "hero" | "footer";
  idPrefix: string;
}

interface DemoPayload {
  confirmUrl: string;
  emailHtml: string;
}

export function WaitlistForm({ source, idPrefix }: WaitlistFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [demo, setDemo] = useState<DemoPayload | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const mountedAt = useRef<number>(Date.now());
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Tier cards elsewhere on the page can preselect a tier.
  useEffect(() => {
    const handler = (e: Event) => {
      const tier = (e as CustomEvent<string>).detail;
      const select = document.getElementById(`${idPrefix}-tier`) as HTMLSelectElement | null;
      if (select && tierIds.includes(tier)) {
        select.value = tier;
      }
      emailInputRef.current?.focus();
    };
    window.addEventListener("lyria:select-tier", handler);
    return () => window.removeEventListener("lyria:select-tier", handler);
  }, [idPrefix]);

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state === "submitting") return;

    const form = ev.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      tierInterest: String(fd.get("tierInterest") ?? ""),
      website: String(fd.get("website") ?? ""),
      formStartedAt: mountedAt.current,
    };

    setState("submitting");
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lyria-source": source,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      if (json.status === "CONFIRMED") {
        setState("already");
        return;
      }

      setEmail(payload.email);
      setDemo(json.demo ?? null);
      setState("success");
    } catch {
      setError("Network error — please check your connection and try again.");
      setState("error");
    }
  }

  /* ── Success / already-confirmed panel ─────────────────────── */
  if (state === "success" || state === "already") {
    return (
      <div
        className="rounded-md border border-line bg-paper-raised p-6 sm:p-8 text-ink shadow-[0_24px_60px_-24px_rgba(10,16,30,0.5)]"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <p className="font-display text-xl sm:text-2xl">
            {state === "already"
              ? "You’re already on the list — thank you."
              : site.finalCta.successNote}
          </p>
        </div>

        {state === "success" && (
          <div className="mt-4 space-y-3">
            <p className="text-sm leading-relaxed text-ink-soft">
              We’ve sent a confirmation link to{" "}
              <span className="font-medium text-ink">{email}</span>. Please
              check your inbox (and just in case, your spam folder) and click
              to confirm — it’s what keeps this list genuinely opt-in.
            </p>

            {demo && (
              <div className="rounded-sm border border-dashed border-gold/50 bg-gold/[0.06] p-3 text-xs leading-relaxed text-ink-soft">
                <span className="eyebrow block text-gold mb-1">Demo mode</span>
                No email provider is configured on this preview, so the real
                email can’t arrive — but you can walk the exact journey below.
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-sm border border-gold/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold hover:text-paper-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Preview the confirmation email
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setState("idle")}
              className="inline-flex items-center gap-1.5 text-xs text-ink-soft underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Undo2 className="h-3 w-3" />
              Made a typo? Submit again
            </button>
          </div>
        )}

        {demo && (
          <EmailPreviewDialog
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            html={demo.emailHtml}
            confirmUrl={demo.confirmUrl}
          />
        )}
      </div>
    );
  }

  /* ── The form ──────────────────────────────────────────────── */
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-md border border-line bg-paper-raised p-6 sm:p-8 text-ink shadow-[0_24px_60px_-24px_rgba(10,16,30,0.5)]"
    >
      <p className="eyebrow text-gold">Waiting list</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label
            htmlFor={`${idPrefix}-name`}
            className="block text-xs font-medium uppercase tracking-[0.12em] text-ink-soft"
          >
            Name
          </label>
          <input
            id={`${idPrefix}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Your name"
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/80 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor={`${idPrefix}-email`}
            className="block text-xs font-medium uppercase tracking-[0.12em] text-ink-soft"
          >
            Email
          </label>
          <input
            id={`${idPrefix}-email`}
            ref={emailInputRef}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-sm border border-line bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/80 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={`${idPrefix}-tier`}
            className="block text-xs font-medium uppercase tracking-[0.12em] text-ink-soft"
          >
            Tier of interest{" "}
            <span className="normal-case tracking-normal text-cream-muted">
              (optional)
            </span>
          </label>
          <select
            id={`${idPrefix}-tier`}
            name="tierInterest"
            defaultValue=""
            className="mt-1.5 w-full appearance-none rounded-sm border border-line bg-white px-3 py-2.5 text-[15px] text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            <option value="">Decide later</option>
            {site.tiers.plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.price}/month (provisional)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Honeypot — hidden from humans, irresistible to bots */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>Don’t fill this out:</label>
        <input
          id={`${idPrefix}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state === "error" && error && (
        <p
          className="mt-4 rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-paper transition-colors hover:bg-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "submitting" ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            Joining…
          </>
        ) : (
          <>
            {site.hero.primaryCta}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </>
        )}
      </button>

      <p className="mt-4 text-[11.5px] leading-relaxed text-ink-soft">
        {site.finalCta.formNote}{" "}
        <PrivacyLink className="underline underline-offset-2 hover:text-ink">
          Privacy Notice
        </PrivacyLink>
        {" · "}
        Unsubscribe anytime in one click.
      </p>

      <p className="sr-only" aria-live="polite">
        {state === "submitting" ? "Submitting your details" : ""}
      </p>
    </form>
  );
}
