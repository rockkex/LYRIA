import { z } from "zod";
import { tierIds } from "@/content/site";

/**
 * Data minimisation by schema: these three fields are the ONLY
 * personal data the waiting list collects. No health questions,
 * no phone number, no free-text boxes that could capture health
 * information.
 */
export const waitlistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(80, "Name is too long"),
  email: z
    .string()
    .trim().toLowerCase()
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
  tierInterest: z
    .union([z.enum([...tierIds] as [string, ...string[]]), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v ? v : null)),

  // ── Spam protection (never stored, never displayed) ──
  /** Honeypot: hidden from humans, irresistible to bots. Any value
      here is caught by isLikelyBot() → silent success (bots must
      never learn the field matters). */
  website: z.string().optional(),
  /** Time-trap: epoch ms when the form finished mounting. */
  formStartedAt: z.number().int().nonnegative().optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

/** Small curated blocklist — top throwaway domains seen in abuse. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "yopmail.com", "trashmail.com", "sharklasers.com",
  "getnada.com", "dispostable.com", "fakeinbox.com", "maildrop.cc",
  "throwawaymail.com", "mailnesia.com", "tempinbox.com", "spam4.me",
  "mohmal.com", "emailondeck.com", "burnermail.io", "mytemp.email",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return DISPOSABLE_DOMAINS.has(domain);
}

/** Bots typically submit in under 1.5s; humans cannot even read the form. */
export const MIN_FORM_SECONDS = 1.5;

export function isLikelyBot(payload: WaitlistInput): boolean {
  // Filled honeypot → bot.
  if (payload.website && payload.website.length > 0) return true;
  // Submitted faster than a human could type → bot.
  if (
    payload.formStartedAt &&
    Date.now() - payload.formStartedAt < MIN_FORM_SECONDS * 1000
  ) {
    return true;
  }
  return false;
}
