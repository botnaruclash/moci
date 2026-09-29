// moci-web — the landing's form, comparison table and demos copy (owner's copy, 29 Sep 2026).
// Lines marked DRAFT were not in the owner's copy: they are the smallest wording the page needs to work (errors, the
// screen after sending) and wait for the owner's wording.

export type Cell = boolean | string;

export const campaign = {
  hero: {
    headline: ["Spune-ne despre", "afacerea ta."],
    sub: "Completezi cererea într-un minut. Verificăm dacă afacerea se potrivește, apoi îți spunem ce avem nevoie ca să începem.",
  },

  // The two offers (owner's brief, 29 Sep 2026). The cards above the form, the switch on it and the table's columns all
  // read from here. Lines marked DRAFT are the smallest wording the flow needs and wait for the owner's wording.
  plans: {
    // DRAFT
    heading: "Alege varianta",
    // DRAFT
    lead: "Formularul e același pentru ambele. Poți schimba varianta până trimiți cererea.",
    // DRAFT
    chosen: "Varianta aleasă",
    free: {
      name: "Gratuit",
      price: "0 MDL",
      points: ["Site de prezentare cu o pagină", "Adaptat pentru telefon", "Publicat pe afacerea.moci.md"],
      fine: null,
      summary: "Site de prezentare cu o pagină, adaptat pentru telefon, publicat pe afacerea.moci.md.",
      // DRAFT
      choose: "Alege Gratuit",
      submit: "Trimite cererea gratuită",
      note: "Nu plătești pentru varianta pe subdomeniul moci.",
    },
    premium: {
      name: "Premium",
      price: "1.999 MDL",
      points: [
        "Același site, conectat la domeniul tău",
        "Rezervări online configurate pentru o persoană / un calendar",
      ],
      fine: "Domeniul se cumpără și se reînnoiește separat.",
      summary:
        "Același site, conectat la domeniul tău, plus rezervări online pentru o persoană / un calendar. Domeniul se cumpără și se reînnoiește separat.",
      // DRAFT
      choose: "Alege Premium",
      // DRAFT
      submit: "Trimite cererea Premium",
      // DRAFT
      note: "Domeniul se cumpără și se reînnoiește separat.",
    },
  },

  form: {
    business: { label: "Numele afacerii" },
    services: { label: "Ce servicii oferi?" },
    presence: { label: "Ai deja un site sau o pagină socială?", optional: "(opțional)" },
    phone: { label: "Număr de telefon" },
    details: { label: "Alte detalii", optional: "(opțional)" },
    steps: "Aplici → confirmăm proiectul → ne trimiți materialele → construim site-ul.",
    // DRAFT
    sending: "Se verifică…",
    errors: {
      business: "Scrie numele afacerii.",
      services: "Scrie pe scurt ce servicii oferi.",
      phone: "Scrie un număr de telefon valid.",
    },
  },

  // DRAFT — the screen after sending. The form is a local demo, so this says plainly that nothing was saved or sent;
  // it never confirms a request as received. Its title is demoMode.result.
  done: {
    text: "Datele sunt completate corect, dar formularul nu e conectat la nimic: nu am primit cererea și nu te va contacta nimeni pe baza ei.",
    summary: { plan: "Varianta", business: "Afacerea", phone: "Telefon" },
    edit: "Înapoi la cerere",
  },

  compare: {
    title: "Începi gratuit. Treci pe domeniul tău când vrei.",
    // The column headings are the plans' "name · price" (set on two lines on phones); the foot row picks a plan.
    columns: { feature: "Primești" },
    // DRAFT — the foot row's buttons: "Alege" on phones, "Alege Gratuit" / "Alege Premium" from 768px.
    choose: "Alege",
    yes: "Da",
    no: "Nu",
    rows: [
      { feature: "Site de prezentare cu o pagină", free: true, premium: true },
      { feature: "Adaptat pentru telefon", free: true, premium: true },
      { feature: "Subdomeniu afacerea.moci.md", free: true, premium: "Opțional" },
      { feature: "Domeniul propriu al afacerii", free: false, premium: "Îl conectăm" },
      { feature: "Rezervări online, pentru o persoană / un calendar", free: false, premium: "Le configurăm" },
    ] satisfies { feature: string; free: Cell; premium: Cell }[],
    note: "Varianta gratuită nu expiră dacă alegi să rămâi pe subdomeniul moci. Domeniul propriu se cumpără și se reînnoiește separat.",
  },

  concepts: {
    title: "Trei afaceri. Trei direcții.",
    lead: "Explorează trei concepte demonstrative și vezi cum poate arăta un site făcut pentru serviciile tale.",
  },
} as const;
