// The three demo sites, shared by splendessa.com (Craft) and getsplendessa.com (the campaign gallery), and ready for
// the /100 gallery. Each is a real, live site for a fictional business: always labelled as a demo, never as a client
// project. Descriptions are written from what each live site actually shows (checked 27 Sep 2026).
//
// Build time: the owner confirmed that the first build of each took under two hours. That is all the label claims —
// not exact minutes, and not the time to an approved launch.

/** moci: the label on each card and in its panel (owner's copy, 29 Sep 2026). */
export const DEMO_LABEL = "Concept demonstrativ";
export const FIRST_BUILD_LABEL = "First build · under 2 hours";

export type DemoSite = {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  /** One or two sentences, specific to the site. */
  readonly description: string;
  /** A local capture of the live desktop hero at 1440 × 900, 16:10 (1200 × 750; Sölv 1600 × 1000 from a 2× capture) — used on phones too. */
  readonly image: string;
  /** What the hero shows, for screen readers. */
  readonly alt: string;
  /** Where the card's name label sits, clear of the hero's headline (default: bottom right). */
  readonly labelAt?: "top" | "bottom";
};

export const demoSites: readonly DemoSite[] = [
  {
    id: "solv",
    name: "Sölv",
    url: "https://solv.splendessa.com/",
    description:
      "Aesthetic medicine in Copenhagen. A quiet, doctor-led clinic site: an editorial hero, treatments with durations and prices, and one clear path to booking a consultation.",
    image: "/demos/solv-desktop.webp",
    alt: "Sölv's homepage: a full-width photograph of a woman with her eyes closed in a treatment room, above the headline “Skin, in its own light.”",
    labelAt: "top",
  },
  {
    id: "cedar",
    name: "Cedar Ridge Outdoor",
    url: "https://cedar.splendessa.com/",
    description:
      "Landscaping and outdoor living in Austin, Texas. A bold, trade-first site with a free-estimate form right in the hero and a click-to-call number at the top.",
    image: "/demos/cedar-desktop.webp",
    alt: "Cedar Ridge Outdoor's homepage: “Backyards built for Texas summers” over a house and fire pit at dusk, beside a free-estimate form.",
  },
  {
    id: "halden",
    name: "Halden Varga Architects",
    url: "https://halden.splendessa.com/",
    description:
      "An architecture studio in London and Lisbon. Oversized type, studio facts set like drawing notes, and full-bleed photographs of houses, libraries and workspaces.",
    image: "/demos/halden-desktop.webp",
    alt: "Halden Varga's homepage: the studio's name in very large type above a photograph of a brick and timber house on the marshes.",
  },
];

export const demoCopy = {
  link: "Check it out for yourself",
  close: "Close",
} as const;
