// The three demo sites, shared by splendessa.com (Craft) and getsplendessa.com (the campaign gallery), and ready for
// the /100 gallery. Each is a real, live site for a fictional business: always labelled as a demo, never as a client
// project. Descriptions are written from what each live site actually shows (checked 27 Sep 2026).
// moci: no build-time label — the offer's only time promise is the hero's (about 3 hours once the project is taken on
// and the materials are in).

/** moci: the label on each card and in its panel (owner's copy, 29 Sep 2026). */
export const DEMO_LABEL = "Concept demonstrativ";

export type DemoSite = {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  /** The kind of business the concept imagines, shown under its name in the panel. */
  readonly kind: string;
  /** One or two sentences, specific to the site. */
  readonly description: string;
  /** A local capture of the live desktop hero at 1440 × 900, 16:10 (1200 × 750; Sölv 1600 × 1000 from a 2× capture) — used on phones too. */
  readonly image: string;
  /** What the hero shows, for screen readers. */
  readonly alt: string;
  /** Where the card's name label sits, clear of the hero's headline (default: bottom right). */
  readonly labelAt?: "top" | "bottom";
};

// moci: the sites themselves are in English (their headlines are quoted as they appear); the text about them is not.
export const demoSites: readonly DemoSite[] = [
  {
    id: "solv",
    name: "Sölv",
    url: "https://solv.splendessa.com/",
    kind: "Clinică de medicină estetică",
    description:
      "Un site calm, cu accent pe medic: fotografie mare în deschidere, proceduri cu durate și prețuri și un singur drum clar spre programarea unei consultații.",
    image: "/demos/solv-desktop.webp",
    alt: "Pagina principală Sölv: fotografia unei femei cu ochii închiși într-un cabinet, deasupra titlului „Skin, in its own light.”",
    labelAt: "top",
  },
  {
    id: "cedar",
    name: "Cedar Ridge Outdoor",
    url: "https://cedar.splendessa.com/",
    kind: "Amenajări exterioare și grădini",
    description:
      "Un site direct, de meserie: formular de cerere de ofertă chiar în prima secțiune și numărul de telefon mereu la vedere, cu apel dintr-o atingere.",
    image: "/demos/cedar-desktop.webp",
    alt: "Pagina principală Cedar Ridge Outdoor: titlul „Backyards built for Texas summers” peste o casă și un foc de tabără la apus, lângă un formular de ofertă.",
  },
  {
    id: "halden",
    name: "Halden Varga Architects",
    url: "https://halden.splendessa.com/",
    kind: "Birou de arhitectură",
    description:
      "Titluri foarte mari, datele biroului așezate ca note pe o planșă și fotografii ample ale caselor, bibliotecilor și spațiilor de lucru proiectate.",
    image: "/demos/halden-desktop.webp",
    alt: "Pagina principală Halden Varga: numele biroului cu litere foarte mari, deasupra fotografiei unei case din cărămidă și lemn.",
  },
];

export const demoCopy = {
  link: "Deschide conceptul (site în engleză)",
  close: "Închide",
  previous: "Exemplul anterior",
  next: "Exemplul următor",
  pause: "Pauză la derularea exemplelor",
  /** "2 din 3" */
  position: (n: number, total: number) => `${n} din ${total}`,
} as const;
