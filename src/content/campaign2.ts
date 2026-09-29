// moci-web — the landing's form, comparison table and demos copy (owner's copy, 29 Sep 2026).
// Lines marked DRAFT were not in the owner's copy: they are the smallest wording the page needs to work (errors, the
// screen after sending) and wait for the owner's wording.

export type Cell = boolean | string;

export const campaign = {
  hero: {
    headline: ["Spune-ne despre", "afacerea ta."],
    sub: "Alegi varianta și completezi cererea într-un minut. Nu plătești nimic pe site: verificăm cererea și te contactăm pentru pașii următori.",
  },

  // The two offers (owner's brief, 29 Sep 2026). The cards above the form, the switch on it and the table's columns all
  // read from here. Lines marked DRAFT are the smallest wording the flow needs and wait for the owner's wording.
  plans: {
    // DRAFT
    heading: "Alege varianta",
    // DRAFT
    lead: "Ambele sunt cereri, fără plată pe site. Formularul e același, iar varianta o poți schimba până la trimitere.",
    // DRAFT
    chosen: "Varianta aleasă",
    free: {
      name: "Gratuit",
      price: "0 MDL",
      points: [
        "Site de prezentare cu o pagină",
        "Adaptat pentru mobil",
        "Publicat pe afacerea.moci.md",
        "Rămâne gratuit cât stai pe subdomeniu",
      ],
      fine: null,
      summary: "Site de prezentare cu o pagină, adaptat pentru mobil, pe afacerea.moci.md. Rămâne gratuit pe subdomeniu.",
      // DRAFT
      choose: "Alege Gratuit",
      submit: "Trimite cererea gratuită",
      note: "Fără plată, nici acum, nici mai târziu, cât rămâi pe subdomeniu.",
    },
    premium: {
      name: "Premium",
      price: "1.999 MDL",
      points: [
        "Tot ce include varianta gratuită",
        "Conectat la domeniul tău",
        "Rezervări online configurate pentru o persoană / un calendar",
      ],
      fine: "Cumpărarea și reînnoirea domeniului se achită separat.",
      summary:
        "Același site pe domeniul tău, plus rezervări online pentru o persoană / un calendar. Domeniul se achită separat.",
      // DRAFT
      choose: "Alege Premium",
      // DRAFT
      submit: "Trimite cererea Premium",
      // DRAFT
      note: "Nu plătești nimic pe site. Stabilim plata după ce discutăm proiectul.",
    },
  },

  form: {
    business: { label: "Numele afacerii" },
    services: { label: "Ce servicii oferi?" },
    presence: { label: "Link la site sau pagina socială", optional: "(opțional)" },
    phone: { label: "Telefon" },
    details: { label: "Alte detalii", optional: "(opțional)" },
    steps: "Trimiți cererea → te contactăm → ne trimiți materialele → prima versiune în aproximativ 3 ore.",
    // DRAFT
    sending: "Se verifică…",
    errors: {
      business: "Scrie numele afacerii.",
      services: "Spune-ne pe scurt ce servicii oferi.",
      phone: "Scrie un număr de telefon valid, de exemplu 069 123 456.",
    },
  },

  // DRAFT — the screen after sending. The form is a local demo, so this says plainly that nothing was saved or sent;
  // it never confirms a request as received. Its title is demoMode.result.
  done: {
    text: "Datele sunt completate corect, dar trimiterea e doar simulată: cererea nu a fost salvată, nu a ajuns la noi și nu te va contacta nimeni pe baza ei.",
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
      { feature: "Adaptat pentru mobil", free: true, premium: true },
      { feature: "Adresa site-ului", free: "Subdomeniu moci.md", premium: "Domeniul tău" },
      { feature: "Conectarea domeniului propriu", free: false, premium: "Inclusă" },
      { feature: "Rezervări online, pentru o persoană / un calendar", free: false, premium: "Configurate" },
    ] satisfies { feature: string; free: Cell; premium: Cell }[],
    note: "Varianta gratuită rămâne gratuită cât stai pe subdomeniu. Cumpărarea și reînnoirea domeniului se achită separat. Nu plătești nimic pe site: te contactăm noi pentru pașii următori.",
  },

  concepts: {
    title: "Trei afaceri. Trei direcții.",
    lead: "Trei concepte demonstrative, create de noi ca exemplu, nu site-uri de clienți. Vezi cum poate arăta un site pentru serviciile tale.",
    // Screen readers: the carousel's name.
    gallery: "Trei concepte demonstrative",
  },
} as const;
