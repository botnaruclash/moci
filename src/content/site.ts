import { publishedLegalLinks } from "./legal";

// Site-wide navigation, call to action and phone — moci (owner's copy, 29 Sep 2026).

export const site = {
  name: "moci",
  // Header, mobile menu and footer, in the owner's order.
  nav: [
    { label: "Exemple", href: "#concepts" },
    { label: "Opțiuni", href: "#compare" },
    { label: "Aplică", href: "#start" },
  ],
  // Legal pages the site really has: none on this one-page landing yet (content/legal.ts), so nothing links to them.
  legal: publishedLegalLinks as readonly { label: string; href: string }[],
  cta: {
    label: "Cere site-ul tău",
    // Every CTA on the page goes to the form on it (StartLink's START_ID).
    href: "#start",
  },
  call: {
    /** The owner's number for the "Sună" buttons, e.g. "+373 …". Not set yet: never invent one. While it is null the
     *  call buttons render as a visible demo (components/ui/CallLink.tsx). */
    phone: null as string | null,
    label: "Sună-ne",
  },
} as const;
