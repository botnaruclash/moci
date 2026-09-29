// moci-web — the landing's form, comparison table and demos copy (owner's copy, 29 Sep 2026).
// Lines marked DRAFT were not in the owner's copy: they are the smallest wording the page needs to work (errors, the
// screen after sending) and wait for the owner's wording.

export type Cell = boolean | string;

export const campaign = {
  hero: {
    headline: ["Spune-ne despre", "afacerea ta."],
    sub: "Completezi cererea într-un minut. Verificăm dacă afacerea se potrivește, apoi îți spunem ce avem nevoie ca să începem.",
  },

  form: {
    business: { label: "Numele afacerii" },
    services: { label: "Ce servicii oferi?" },
    presence: { label: "Ai deja un site sau o pagină socială?", optional: "(opțional)" },
    phone: { label: "Număr de telefon" },
    details: { label: "Alte detalii", optional: "(opțional)" },
    submit: "Trimite cererea gratuită",
    steps: "Aplici → confirmăm proiectul → ne trimiți materialele → construim site-ul.",
    free: "Nu plătești pentru varianta pe subdomeniul moci.",
    // DRAFT
    sending: "Se trimite…",
    errors: {
      business: "Scrie numele afacerii.",
      services: "Scrie pe scurt ce servicii oferi.",
      phone: "Scrie un număr de telefon valid.",
    },
  },

  // DRAFT — the screen after "Trimite cererea gratuită".
  done: {
    title: "Am primit cererea.",
    text: (phone: string) =>
      `Verificăm dacă afacerea se potrivește, apoi te contactăm la ${phone} ca să-ți spunem ce avem nevoie ca să începem.`,
    edit: "Modifică cererea",
  },

  compare: {
    title: "Începi gratuit. Treci pe domeniul tău când vrei.",
    // Each paid/free heading is "name · price", set on two lines on phones.
    columns: { feature: "Primești", free: ["Gratuit", "0 MDL"], paid: ["Upgrade", "1.750 MDL"] },
    yes: "Da",
    no: "Nu",
    rows: [
      { feature: "Site de prezentare cu o pagină", free: true, paid: true },
      { feature: "Adaptat pentru telefon", free: true, paid: true },
      { feature: "Subdomeniu afacerea.moci.md", free: true, paid: "Opțional" },
      { feature: "Domeniul propriu al afacerii", free: false, paid: "Îl conectăm" },
      { feature: "Rezervări online, pentru un calendar", free: false, paid: "Le configurăm" },
    ] satisfies { feature: string; free: Cell; paid: Cell }[],
    note: "Varianta gratuită nu expiră dacă alegi să rămâi pe subdomeniul moci. Domeniul propriu se cumpără și se reînnoiește separat.",
    call: "Sună pentru upgrade",
  },

  concepts: {
    title: "Trei afaceri. Trei direcții.",
    lead: "Explorează trei concepte demonstrative și vezi cum poate arăta un site făcut pentru serviciile tale.",
  },
} as const;
