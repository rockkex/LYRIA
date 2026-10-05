/**
 * ─────────────────────────────────────────────────────────────
 * CONSENT WORDING — versioned, immutable once published
 * ─────────────────────────────────────────────────────────────
 * The exact sentence shown beside the signup form. The version
 * + full text are stored on every ConsentLog row, so any past
 * signup can always be tied to the precise wording the person
 * saw at the moment they consented (UK GDPR accountability).
 *
 * To change wording: add a NEW entry below (never edit an old
 * one) and make it active. Old versions remain available for
 * audit forever.
 */

export interface ConsentWording {
  version: string;
  /** Exact sentence displayed under the submit button. */
  text: string;
  active: boolean;
}

export const CONSENT_WORDINGS: ConsentWording[] = [
  {
    version: "v1.0",
    text:
      "By joining, you agree that Lyria Health Ltd may email you about the launch and your selected tier. " +
      "You can unsubscribe with one click at any time. We store your name, email and tier interest only — " +
      "no health data. See our Privacy Notice.",
    active: true,
  },
];

export function activeConsent(): ConsentWording {
  const w = CONSENT_WORDINGS.find((x) => x.active);
  if (!w) throw new Error("No active consent wording configured");
  return w;
}
