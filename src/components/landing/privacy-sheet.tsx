"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { site } from "@/content/site";
import { activeConsent } from "@/lib/consent";

/**
 * Small client-side trigger so server components can open the
 * privacy sheet without prop drilling: <PrivacyLink>…</PrivacyLink>
 */
export function PrivacyLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("lyria:open-privacy"))}
      className={className ?? "underline underline-offset-2 hover:text-ink"}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <div className="mt-2 space-y-2.5 text-sm leading-relaxed text-ink-soft">
        {children}
      </div>
    </div>
  );
}

export function PrivacySheet() {
  const [open, setOpen] = useState(false);
  const consent = activeConsent();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("lyria:open-privacy", handler);
    return () => window.removeEventListener("lyria:open-privacy", handler);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {/* Hidden functional trigger; visible triggers use PrivacyLink */}
        <button type="button" className="sr-only" aria-hidden="true" tabIndex={-1}>
          Open privacy notice
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-md border-l border-line bg-paper p-0 sm:max-w-lg"
      >
        <div className="border-b border-line bg-paper-raised px-6 py-5">
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="font-display text-2xl text-ink">
              Privacy Notice
            </SheetTitle>
            <SheetDescription className="text-xs leading-relaxed text-ink-soft">
              Consent wording {consent.version} · Waiting list only — no
              clinical services are provided at this stage.
            </SheetDescription>
          </SheetHeader>
        </div>

        <ScrollArea className="h-[calc(100vh-88px)]">
          <div className="thin-scroll px-6 py-6">
            <Section title="Who we are">
              <p>
                {site.legalName} (“Lyria”, “we”) is the controller of the
                personal data collected through this website ({site.domain}).
                Contact:{" "}
                <a
                  className="underline underline-offset-2 hover:text-ink"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
                .
              </p>
            </Section>

            <Section title="What we collect — and what we don’t">
              <p>
                The waiting list collects only: your <strong>name</strong>,{" "}
                <strong>email address</strong>, and — optionally — the{" "}
                <strong>membership tier you’re interested in</strong>. We also
                keep a technical record of when you consented, the exact
                wording shown, and where on the site you signed up.
              </p>
              <p>
                We do <strong>not</strong> collect health data, payment
                details, or any special category data on this site, and we do
                not use tracking cookies or advertising pixels.
              </p>
            </Section>

            <Section title="Why we use it (lawful basis)">
              <p>
                We use your details solely to send launch updates about Lyria,
                matched to your selected tier. The lawful basis is your{" "}
                <strong>consent</strong> (UK GDPR Art. 6(1)(a) and PECR). We
                practise <strong>double opt-in</strong>: after you submit the
                form we email you a confirmation link, and you are only added
                to the list after you click it.
              </p>
            </Section>

            <Section title="Who processes your data">
              <p>
                Emails are delivered through a reputable transactional email
                provider (Resend) acting as our processor under a
                data-processing agreement. Data is stored in the European
                Economic Area wherever possible. We never sell your data, and
                we do not share it with third parties for their own marketing.
              </p>
            </Section>

            <Section title="How long we keep it">
              <p>
                Until you unsubscribe, or for 12 months after launch
                notifications begin — whichever comes first — after which your
                entry is deleted or anonymised. If you request deletion sooner,
                we act within 30 days.
              </p>
            </Section>

            <Section title="Your rights">
              <p>
                You can unsubscribe with one click from any email. You may also
                ask us for access to your data, correction, deletion, a copy
                (portability), or object to processing at any time — email{" "}
                <a
                  className="underline underline-offset-2 hover:text-ink"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>{" "}
                and we will respond within one month.
              </p>
              <p>
                You also have the right to complain to the Information
                Commissioner’s Office (ico.org.uk) if you believe we have
                mishandled your data — though we would appreciate the chance to
                put things right first.
              </p>
            </Section>

            <Section title="Consent wording in force">
              <p className="rounded-sm border border-line bg-paper-raised p-3 text-xs leading-relaxed text-ink-soft">
                “{consent.text}”
              </p>
              <p className="text-xs">
                Version {consent.version}. Every signup records the wording
                version shown at that moment, so our consent records are
                provable.
              </p>
            </Section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
