/**
 * ─────────────────────────────────────────────────────────────
 * LYRIA HEALTH — SITE CONTENT (single source of truth)
 * ─────────────────────────────────────────────────────────────
 * All copy lives here so supplied compliance wording can be
 * replaced exactly as written, without touching components.
 *
 * Copy marked  [client]  is taken verbatim from the client's
 * current draft at lyriahealth.co.uk. Sections written as
 * placeholders until final copy is supplied are marked
 *  [draft — await client copy]  and written in the same voice.
 */

export const site = {
  name: "Lyria",
  legalName: "Lyria Health Ltd",
  email: "hello@lyria.health",
  domain: "lyriahealth.co.uk",
  year: 2026,

  /** Shown in the announcement bar — honesty as the opening note. [client] */
  statusBadge: "Registering with the CQC — not yet accepting patients",

  hero: {
    tagline: "Healthcare before you need it", // [client]
    titleA: "Care,",
    titleB: "before", // rendered in italic gold
    titleC: "it’s urgent.",
    sub: "A membership built around one idea: your health shouldn’t only get attention once something’s wrong. GP consultations and biomarker screening, on a plan that catches change early — without the wait.", // [client]
    primaryCta: "Join the waitlist",
    secondaryCta: "See membership tiers",
  },

  stat: {
    // [client]
    eyebrow: "Typical NHS GP wait (selected areas)",
    nhsValue: "2–3",
    nhsUnit: "wks",
    nhsNote: "for a routine, non-urgent appointment",
    lyriaLabel: "Lyria target",
    lyriaValue: "Same week,",
    lyriaValue2: "every tier",
  },

  quote: {
    // [client]
    text: "I could tell you what my cholesterol was two years ago. I have no idea what it is now, or what to do about it.",
    attribution: "the gap Lyria is built to close",
  },

  howItWorks: {
    // [draft — await client copy]
    eyebrow: "How it works",
    title: "Three steps, no surprises",
    intro:
      "Joining the waiting list asks for less than a minute and no commitment. Here is exactly what happens next — and what doesn’t happen yet.",
    steps: [
      {
        num: "01",
        title: "Leave your details",
        body: "Your name, email, and the tier that fits — nothing more. We don’t ask for payment details, and we never ask for health information at this stage.",
      },
      {
        num: "02",
        title: "Confirm by email",
        body: "You’ll receive a confirmation email to verify your address — a deliberate double opt-in, so nobody is added to this list without their own explicit action.",
      },
      {
        num: "03",
        title: "Hear first at launch",
        body: "Once CQC registration completes and your area opens, confirmed members are invited to activate their membership in order — ahead of any public launch.",
      },
    ],
  },

  tiers: {
    // [client]
    eyebrow: "Membership tiers",
    title: "Three ways in, one standard of care",
    intro:
      "Every tier includes GP consultations and biomarker screening. Higher tiers add depth — more consultations, a wider panel, and closer tracking over time.",
    note: "Pricing provisional · No payment taken at sign-up · CQC registration pending",
    plans: [
      {
        id: "essential",
        name: "Essential",
        visits: "8",
        visitsLabel: "GP visits / yr",
        tagline: "For staying ahead of the basics",
        body: "Eight GP consultations a year and an annual screening across the markers that matter most — cholesterol, thyroid, liver and kidney function, blood count.",
        price: "£24",
        features: [
          "8 GP consultations a year",
          "Annual biomarker screening",
          "Cholesterol, thyroid, liver & kidney, blood count",
          "Same-week appointments",
        ],
      },
      {
        id: "plus",
        name: "Plus",
        visits: "16",
        visitsLabel: "GP visits / yr",
        tagline: "For tracking change over time",
        body: "Sixteen consultations, message-based GP access between visits, and screening twice a year across an expanded panel — so you can see what’s actually moving.",
        price: "£49",
        features: [
          "16 GP consultations a year",
          "Message-based GP access between visits",
          "Screening twice a year",
          "Expanded biomarker panel",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        visits: "24",
        visitsLabel: "GP visits / yr",
        tagline: "For the full picture",
        body: "Our deepest consultation allowance, comprehensive screening, priority specialist referral coordination, and a dedicated care coordinator.",
        price: "£99",
        features: [
          "24 GP consultations a year",
          "Comprehensive screening panel",
          "Priority specialist referral coordination",
          "Dedicated care coordinator",
        ],
      },
    ],
  },

  doctor: {
    // [client]
    eyebrow: "Clinical governance",
    title: "Led by a practising doctor",
    credential: "MBBS, BSc Endocrinology — Imperial College London",
    body1:
      "Lyria is built and clinically governed by a doctor still working within the NHS — not a wellness brand borrowing medical language. Every protocol, from consultation to result escalation, is written the way we’d want it done for our own family.",
    body2:
      "We’re currently completing CQC registration. Nothing here is a live clinical service yet — joining the waitlist means you’ll hear first when it is.",
    pullLine: "written the way we’d want it done for our own family.",
  },

  faq: {
    // [draft — await client copy]
    eyebrow: "FAQ",
    title: "Straight answers",
    items: [
      {
        q: "Is Lyria a live service yet?",
        a: "No. Lyria is currently completing registration with the Care Quality Commission (CQC) and is not yet delivering regulated healthcare services. This site is a waiting list only — there are no bookings, payments or clinical services available at this stage.",
      },
      {
        q: "What happens after I join the waiting list?",
        a: "First, you’ll receive an email asking you to confirm your subscription — we only add confirmed addresses to the list. After that you’ll receive occasional launch updates, matched to the tier you selected. Every email includes a one-click unsubscribe link.",
      },
      {
        q: "Will I be charged anything now?",
        a: "No. We never ask for payment details at the waiting-list stage. The prices shown are provisional and will be confirmed before launch — and there is nothing to cancel, because nothing has been purchased.",
      },
      {
        q: "What information do you collect?",
        a: "Only your name, email address and — optionally — the tier you’re interested in. We do not collect any health information on this site. Clinical consultations, if you join at launch, will run on a separate platform under its own safeguards. You can ask us to delete your details at any time by emailing us.",
      },
      {
        q: "How much will membership cost?",
        a: "The indicative pricing is £24, £49 and £99 per month for the Essential, Plus and Premium tiers respectively. These are provisional figures shown to help you choose a tier of interest; final pricing will be confirmed before launch and may change.",
      },
      {
        q: "When will Lyria launch?",
        a: "We’re opening membership in phases as our clinical and diagnostic partners come online, following completion of CQC registration. We won’t guess a date in public — confirmed members will be the first to know.",
      },
    ],
  },

  finalCta: {
    // [client] — intro paragraph from the client's waitlist section
    title: "Be first to join",
    intro:
      "We’re opening membership in phases as our clinical and diagnostic partners come online. No spam — just a note when your tier is ready.",
    successNote: "You’re on the list — thank you.", // [client]
    formNote: "We’ll only use this to tell you when Lyria launches in your area.", // [client]
  },

  footer: {
    // [client]
    cqcDisclaimer:
      "Lyria is currently completing registration with the Care Quality Commission and is not yet delivering regulated healthcare services. Membership tiers, consultation numbers and pricing shown are provisional and subject to change ahead of launch. Nothing on this page constitutes medical advice, and no diagnosis, treatment or health outcome is implied or guaranteed.",
    companyLine:
      "Lyria is a trading name of Lyria Health Ltd, a company registered in England and Wales (company number: to be added on incorporation). Registered office: [address to be added].",
  },
} as const;

export type TierId = (typeof site.tiers.plans)[number]["id"];
export const tierIds: string[] = site.tiers.plans.map((p) => p.id);
