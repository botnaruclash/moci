// VARIANT B — a copy of campaign.ts for /get-preview2. Edit this file, not campaign.ts, when changing B.
// The 100 Website Experiment — campaign page copy (getsplendessa.com, previewed at /get-preview).
// Product decisions come from the owner's brief (25 Sep 2026). Anything touching terms — selection, deadlines, domain,
// hosting, refunds — is DRAFT for owner review and must be confirmed before the page takes traffic.
import { BRAND_URL } from "@/lib/sites";


export const campaign = {
  preview: {
    long: "Preview: online payment isn't connected yet. Nothing is charged.",
    short: "Preview · online payment not connected yet",
    /** When checkout runs against PayPal Sandbox. */
    sandboxLong: "Test mode: payments use PayPal Sandbox. No real money moves.",
    sandboxShort: "Test mode · PayPal Sandbox, no real money",
  },
  identifier: "The 100 Website Experiment",
  agencyLink: { label: "splendessa.com", href: BRAND_URL },
  /** The experiment's public results (getsplendessa.com/100): proof, kept secondary to "Start my website". */
  resultsLink: { label: "Results", href: "/results" },
  /** The same page, named in full in the footer. */
  resultsFooterLabel: "Experiment results",

  hero: {
    headline: ["Your website,", "without the wait."],
    sub: "Tell us about your business. It takes about a minute.",
  },

  form: {
    kicker: "Start here",
    business: { label: "Business name", placeholder: "e.g. Maison Lune" },
    links: {
      label: "Where can we find it?",
      hint: "Instagram, TikTok, Google Maps, your website or any other profile.",
      placeholder: "@handle or a link",
      add: "Add another link",
      remove: "Remove link",
      noPresence: "We're not online yet",
      city: { label: "City", placeholder: "e.g. Lisbon" },
      about: { label: "What does your business do?", placeholder: "One or two sentences is plenty." },
    },
    contact: {
      label: "How can we reach you?",
      hint: "Pick one or more.",
      preferred: "Preferred",
      methods: {
        instagram: { label: "Instagram DM", field: "Instagram handle", placeholder: "@yourhandle", inputMode: "text" },
        whatsapp: { label: "WhatsApp", field: "WhatsApp number", placeholder: "+351 912 345 678", inputMode: "tel" },
        email: { label: "Email", field: "Email address", placeholder: "you@business.com", inputMode: "email" },
      },
    },
    optional: {
      title: "Optional",
      line: "Skip these and we'll lead the creative direction.",
      /** The phone toggle for the optional design questions (always open on desktop). */
      show: "Add colours or references",
      hide: "Hide colours and references",
    },
    colours: {
      label: "Colours",
      directions: {
        warm: { label: "Warm & natural", swatch: ["#efe2d2", "#c69c72", "#6a4a34"] },
        bold: { label: "Bold & bright", swatch: ["#ffd23f", "#e5484d", "#1c2b4a"] },
        dark: { label: "Dark & premium", swatch: ["#141214", "#3d302b", "#c8a86b"] },
        soft: { label: "Soft & calm", swatch: ["#f5e6e2", "#dfe5d8", "#9aa89a"] },
      },
      chooseForMe: "Choose for me",
      describe: "Or describe them",
      describePlaceholder: "e.g. navy and gold, or our logo colours",
    },
    notes: {
      label: "Must-haves or references",
      placeholder: "A site you like, a page you need, a booking link…",
    },
    submit: "Continue to my options",
    previewNote: "Your details are saved when you continue. Nothing is charged.",
    saving: "Saving…",
    saveFailed: "We couldn't save that just now. Please try again.",
  },

  choose: {
    forLabel: "For",
    edit: "Edit details",
    title: "Choose how we build it.",
    // Priority is shown first (and on the left on desktop); Free stays a full, genuine option.
    paid: {
      tag: "Priority build",
      price: "€99 once",
      text: "Guaranteed build. Your first working website preview within 12 hours after payment completes.",
      points: ["Your own domain — registration paid by you, separately.", "Showing it in our gallery is up to you."],
      action: "Get priority for €99",
    },
    free: {
      tag: "Free waitlist",
      price: "€0",
      text: "Apply for a free build. Splendessa selects businesses; a build and delivery date aren't guaranteed.",
      points: ["If selected: a Splendessa subdomain (yourname.splendessa.com, if available)."],
      action: "Join the free waitlist",
      consent: "I agree Splendessa may show my business name and website in its public gallery if selected.",
      consentMissing: "Please agree to the gallery condition to join the free waitlist.",
    },
    choosing: "Saving your choice…",
    both: "Both get the same design standard, the first 12 months of hosting and one round of changes within 30 days.",
  },

  waitlistDone: {
    title: "You're on the waitlist.",
    text: (channel: string) => `We saved your application and will contact you on ${channel} if you're selected.`,
    reference: "Your reference",
    back: "Back to the options",
    /** A small, optional second path — same application, no new form. */
    upgrade: {
      title: "Need a guaranteed build?",
      text: "Get Priority for €99 with the same application. Your free waitlist place stays as it is unless you pay.",
      action: "Get Priority for €99",
    },
  },

  checkout: {
    title: "Checkout preview",
    /** With live PayPal payments. */
    titleLive: "Checkout",
    saved: "We saved your request. Online payment isn't available yet; we'll contact you with next steps. Nothing has been charged.",
    /** When PayPal checkout is available. */
    readyToPay: "We saved your request. Pay €99 with PayPal below — your working preview link is due 12 hours after the payment completes.",
    essentials: {
      title: "Before you pay",
      intro: "The 12 hours start when your payment completes, so we check we have what we need to start building:",
      items: { business: "Your business name", identity: "What your business is", contact: "A way to reach you" },
      optional: "Logo, photos, colours and references are welcome any time — they never move the deadline.",
      identityLabel: "What does your business do?",
      identityHint: "One or two sentences. We'll build from this and your link.",
      identityPlaceholder: "e.g. A two-chair barber shop in Lisbon, walk-ins and bookings.",
      save: "Save and continue",
      edit: "Add it in your details",
    },
    sandboxNote: "Test mode: PayPal Sandbox. No real money moves.",
    loading: "Loading PayPal…",
    processing: "Confirming your payment with PayPal…",
    cancelled: "Payment cancelled. Nothing was charged. You can try again when you're ready.",
    declined: "PayPal declined that payment method. Nothing was charged — choose another way to pay.",
    pending: "PayPal is still processing your payment. We'll confirm your build as soon as it clears — you don't need to pay again.",
    failed: "We couldn't confirm the payment just now. If PayPal took the money, we'll confirm it automatically — please don't pay again. Your reference is below.",
    duplicate: "This application was already paid. We'll refund the extra payment — you don't need to do anything.",
    unavailable: "PayPal couldn't load. Check your connection and try again. Nothing was charged.",
    paidTitle: "Payment received.",
    paidText: (channel: string, deadline: string) =>
      `€99.00 paid. Your working preview link will be ready by ${deadline}. We'll send it on ${channel}; your site launches after your feedback and approval.`,
    paidTextNoDeadline: (channel: string) =>
      `€99.00 paid. Your working preview link will be ready within 12 hours of your payment. We'll send it on ${channel}; your site launches after your feedback and approval.`,
    dueLabel: "Preview link due",
    captureLabel: "PayPal transaction",
    rows: {
      build: "Priority website build",
      domain: "Domain registration",
      domainValue: "Paid by you, at your registrar",
      deadline: "First working version",
      deadlineValue: "A preview link within 12 hours of payment",
      total: "Total today",
    },
    /** While online payment isn't open: no terms are presented yet. */
    noteClosed: "Refund and cancellation terms will be shown here before online payment opens.",
    /** The first block of the checkout: what is being bought, for how much, and when the deadline starts. */
    summary: {
      forLabel: "Website for",
      total: "Total today",
      totalValue: "€99.00 · one time",
      deadline: "First working preview",
      deadlineValue: "Within 12 hours of PayPal confirming your payment",
      domain: "Domain registration",
      domainValue: "Paid by you, separately",
    },
    fullTerms: "Full terms",
    sellerLabel: "Seller",
    /** Under the unticked request to start straight away, until it's ticked. */
    startRequestHint:
      "Payment opens when you tick the box. Without it we'd have to wait until the 14-day withdrawal period ends, so the 12 hours couldn't apply — write to us if you'd prefer that.",
    // The checkout's short version of /terms (content/legal.ts); "Full terms" is linked after it once /terms is published.
    // Shown only while public checkout is open, which can't happen in production until /terms is published.
    note: "€99, one time, for a priority website build. The 12 hours start when PayPal confirms your payment as completed. If we don't send you the private link to your first working version within those 12 hours, you can ask for a full refund of the €99. Includes 12 months of hosting from when your approved site goes live on your domain, and one round of changes within 30 days. Your domain stays yours and is paid by you. If you buy as a consumer, you can withdraw within 14 days; if you asked us to start straight away, you pay for the work done until then.",
    pay: "Pay €99",
    payDisabled: "Payments are not connected in this preview",
    back: "Back to the options",
  },

  concepts: {
    kicker: "Concept Builds",
    title: "Three businesses, three directions.",
    lead: "Fictional businesses we designed to show range. They are demos, not client projects.",
  },

  compare: {
    kicker: "Free or priority",
    title: "What each way gets you.",
    line: "Both are custom websites, built to the same standard. The difference is certainty and speed.",
    columns: { feature: "Feature", free: "Free waitlist", paid: "€99 Priority" },
    yes: "Included",
    no: "Not included",
    rows: [
      { feature: "Custom website", free: true, paid: true },
      {
        feature: "Guaranteed build",
        note: "Free builds are selected by Splendessa, with no guaranteed date.",
        free: false,
        paid: true,
      },
      { feature: "Production priority", free: false, paid: true },
      {
        feature: "Working preview link within 12 hours",
        note: "The 12 hours start when your payment completes. Launch follows your feedback and approval.",
        free: false,
        paid: true,
      },
      {
        feature: "Your own domain",
        note: "Domain registration is paid by you, separately.",
        free: false,
        paid: true,
      },
      { feature: "Splendessa subdomain", free: true, paid: false },
      { feature: "First 12 months of hosting", free: true, paid: true },
      { feature: "One revision round within 30 days", free: true, paid: true },
    ],
    /** While the priority build's terms aren't published: no draft is presented as terms. */
    termsPending: "The priority build's full terms are published here before online payment opens.",
    /** Once they are. */
    termsLink: "Terms of the priority build",
  },

  closing: {
    kicker: "The 100 Website Experiment",
    title: ["Your website", "starts here."],
    cta: "Start my website",
  },

  /** Beside the form's submit button, once the privacy notice is published. */
  privacyNote: { text: "We use your details to review your application and contact you about it.", link: "How we use your details" },

  footer: {
    note: "Splendessa · Human direction. AI-speed execution.",
  },
} as const;

export type ContactMethod = keyof typeof campaign.form.contact.methods;
export type ColourDirection = keyof typeof campaign.form.colours.directions;
