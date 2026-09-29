import { publishedLegalLinks } from "./legal";

// Site-wide navigation and call to action. Labels are working copy, not final messaging.

// Every call to action on splendessa.com sends the reader to the campaign site, where they describe their business and
// then choose the free waitlist or a priority build. Fixed on purpose: no environment variable or fallback can point
// these buttons anywhere else.
// moci-web: one page, so every CTA goes to the form on it (StartLink's START_ID).
const CTA_URL = "#start";

export const site = {
  name: "Splendessa",
  // In page order.
  nav: [
    // moci-web: only the sections this page has. "How it works" and "FAQ" had no section here and are left out.
    { label: "Craft", href: "#concepts" },
    { label: "Offer", href: "#compare" },
  ],
  // moci-web: the header's links (Header and its mobile menu), in page order: the form, the two options, the demos.
  // The form's label is its own kicker (campaign2.form.kicker); the other two keep the footer's labels.
  headerNav: [
    { label: "Start here", href: "#start" },
    { label: "Offer", href: "#compare" },
    { label: "Craft", href: "#concepts" },
  ],
  // Legal pages the site really has: Terms and Privacy appear only once published (content/legal.ts), so nothing can
  // link to a page that answers 404 or to unapproved text.
  legal: publishedLegalLinks as readonly { label: string; href: string }[],
  cta: {
    label: "Start my website",
    // Every CTA on the page uses this one destination.
    href: CTA_URL,
  },
} as const;
