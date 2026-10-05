"use client";

import type { MouseEvent } from "react";
import { ArrowRight } from "lucide-react";

interface TierCtaProps {
  tierId: string;
  label?: string;
  /** featured card renders cream-on-ink styling */
  featured?: boolean;
}

/**
 * Tier card CTA: preselects the tier in the waitlist form(s)
 * and smooth-scrolls the visitor to the final call-to-action.
 */
export function TierCta({ tierId, label = "Join the waiting list", featured }: TierCtaProps) {
  function onClick(ev: MouseEvent<HTMLAnchorElement>) {
    ev.preventDefault();
    window.dispatchEvent(new CustomEvent("lyria:select-tier", { detail: tierId }));
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <a
      href="#waitlist"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        featured
          ? "text-paper hover:text-gold-soft"
          : "text-ink hover:text-gold"
      }`}
      aria-label={`${label} — ${tierId} tier`}
    >
      {label}
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      />
    </a>
  );
}
