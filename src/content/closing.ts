// Closing CTA (S8) copy — DRAFT for layout testing only. Not approved production copy.
//
// Rules for this section (the blueprint's S8 and the Phase 9 brief):
//  1. No new argument. The page has already made the case; this turns it into one decision.
//  2. One primary action, the site CTA (site.cta). No second button, no email link until an address is supplied.
//  3. No urgency, no guarantees, no results, no price, no new commercial terms.
//  4. The next step is the campaign site: describe the business, then choose the free waitlist or a priority build.
//     Nothing here promises a build, a date or a price.

export const closingCopy = {
  kicker: "Next step",
  // Display lines, each its own rising mask. Keep them short: at 56px on phones a longer line wraps inside its mask.
  statement: ["Ready when", "you are."],
  line: "Starting from scratch or rethinking the site you have? Tell us about your business, then choose the free waitlist or a priority build.",
} as const;
