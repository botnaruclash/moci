// Hero copy — DRAFT (structural pass, 19 Sep 2026). Not final copywriting.
// The Hero has one job: Splendessa designs and builds websites and redesigns, fast, with people directing the work,
// and the next step is starting a website on getsplendessa.com. The ≈12 hours is explained once, in the Offer.

export const heroCopy = {
  // Two fixed lines, Reference 2 style.
  headline: ["Built fast.", "Made for you."],
  // Each line is justified to the headline block on desktop.
  descriptor: ["New websites and redesigns,", "directed by people, built fast."],
  card: {
    heading: "A first working build in about 12 hours.",
    condition: "A working preview link, 12 hours after a priority build is paid.",
    // moci-web: there is no "How it works" section here; it points to the comparison table until the copy is decided.
    secondaryLink: { label: "See how it works", href: "#compare" },
  },
} as const;
