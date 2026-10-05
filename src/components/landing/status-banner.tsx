"use client";

import { useState } from "react";
import { CircleCheck, CircleX, X } from "lucide-react";

export type LandingState = "none" | "confirmed" | "unsubscribed" | "error";

interface StatusBannerProps {
  state: LandingState;
  reason?: string | null;
}

const MESSAGES: Record<string, { title: string; body: string }> = {
  confirmed: {
    title: "Subscription confirmed — you’re on the list.",
    body: "Thank you for verifying your email address. We’ll be in touch when your tier opens.",
  },
  unsubscribed: {
    title: "You’ve been unsubscribed.",
    body: "That’s done immediately, and we’re sorry to see you go. You’re welcome back any time.",
  },
  missing_token: {
    title: "That link is incomplete.",
    body: "Please use the exact link from your email, or join again below — it takes under a minute.",
  },
  invalid_token: {
    title: "That link has expired or was already used.",
    body: "If you meant to join the list, simply submit the form again and we’ll send a fresh confirmation email.",
  },
  unsubscribed_token: {
    title: "This address was unsubscribed before the link was used.",
    body: "Join again with the form below if you’d like back on the list.",
  },
  server: {
    title: "Something went wrong on our side.",
    body: "Please try again in a moment — if the problem persists, email us and we’ll sort it out.",
  },
};

/**
 * Landing state banner for users returning from confirm /
 * unsubscribe email links (?state=…). Rendered at the very top
 * of the page so the outcome is the first thing they see.
 */
export function StatusBanner({ state, reason }: StatusBannerProps) {
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  if (state === "none") return null;

  const key =
    state === "error" ? reason ?? "server" : state;
  const currentKey = `${state}:${key}`;
  if (dismissedKey === currentKey) return null;

  const msg = MESSAGES[key] ?? MESSAGES.server;
  const isError = state === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative z-[60] px-4 py-3 sm:px-6 ${
        isError
          ? "border-b border-gold/40 bg-[#efe3cb] text-ink"
          : "border-b border-gold/40 bg-[#e9dfc8] text-ink"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3">
        {isError ? (
          <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        ) : (
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{msg.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
            {msg.body}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissedKey(currentKey)}
          aria-label="Dismiss notification"
          className="rounded-sm p-1 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
