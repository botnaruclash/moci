// moci-web — the landing's form, comparison table and demos copy (owner's direction, 30 Sep 2026).

export type Cell = boolean | string;

export const campaign = {
  hero: {
    headline: ["Spune-ne despre", "afacerea ta."],
    sub: "Alegi varianta și completezi cererea într-un minut. Te contactăm pentru pașii următori.",
  },

  // The two offers (owner's direction, 30 Sep 2026). Premium is the main offer and comes first everywhere (plan.ts's
  // PLANS order); Gratuit is the guaranteed alternative for real service businesses. The cards above the form, the
  // switch on it and the table's columns all read from here.
  plans: {
    heading: "Alege varianta",
    // The page's one mention that nothing is paid on the site.
    lead: "Același formular pentru ambele, fără plată pe site. Poți schimba varianta oricând până trimiți.",
    chosen: "Varianta aleasă",
    premium: {
      name: "Premium",
      price: "2.000 MDL",
      points: ["Site pe domeniul tău", "Rezervări online pentru clienții tăi", "Arată impecabil pe telefon"],
      fine: "Domeniul îl cumperi tu, pe contul tău. Noi îl configurăm.",
      summary: "Site pe domeniul tău, cu rezervări online.",
      choose: "Alege Premium",
      submit: "Trimite cererea Premium",
      note: "Stabilim plata după ce discutăm proiectul.",
    },
    free: {
      name: "Gratuit",
      price: "0 MDL",
      points: ["Site pe afacerea.moci.md", "Clienții te contactează pe WhatsApp sau Instagram", "Treci oricând la Premium"],
      fine: "Garantat pentru afacerile reale de servicii.",
      summary: "Site pe afacerea.moci.md, cu contact prin WhatsApp sau Instagram.",
      choose: "Alege Gratuit",
      submit: "Trimite cererea gratuită",
      note: "Rămâne gratuit cât stai pe subdomeniu.",
    },
  },

  form: {
    business: { label: "Numele afacerii" },
    services: { label: "Ce servicii oferi?" },
    // Optional: a business without a social page applies the same way.
    presence: { label: "Instagram, Facebook sau site", optional: "(opțional, dacă ai)" },
    phone: { label: "Telefon" },
    details: { label: "Alte detalii", optional: "(opțional)" },
    steps: "Trimiți cererea → te contactăm → ne trimiți materialele → site-ul e gata în mai puțin de 3 ore.",
    sending: "Se verifică…",
    errors: {
      business: "Scrie numele afacerii.",
      services: "Spune-ne pe scurt ce servicii oferi.",
      phone: "Scrie un număr de telefon valid, de exemplu 069 123 456.",
    },
  },

  // The screen after sending. The form is a local demo, so this says plainly that nothing was saved or sent; it never
  // confirms a request as received. Its title is demoMode.result.
  done: {
    text: "Datele sunt completate corect, dar trimiterea e doar simulată: cererea nu a fost salvată, nu a ajuns la noi și nu te va contacta nimeni pe baza ei.",
    summary: { plan: "Varianta", business: "Afacerea", phone: "Telefon" },
    edit: "Înapoi la cerere",
  },

  compare: {
    title: "Pe domeniul tău. Sau începi gratuit.",
    // The column headings are the plans' "name · price" (set on two lines below 1280px), Premium first; the foot row
    // picks a plan.
    columns: { feature: "Primești" },
    // The foot row's buttons: "Alege" below 1024px, "Alege Premium" / "Alege Gratuit" from 1024px.
    choose: "Alege",
    yes: "Da",
    no: "Nu",
    rows: [
      { feature: "Site de prezentare", premium: true, free: true },
      { feature: "Adaptat pentru mobil", premium: true, free: true },
      { feature: "Adresa site-ului", premium: "Domeniul tău", free: "Subdomeniu moci.md" },
      { feature: "Rezervări online, pentru o persoană / un calendar", premium: "Configurate", free: false },
    ] satisfies { feature: string; premium: Cell; free: Cell }[],
    note: "Domeniul pentru Premium îl cumperi pe contul tău; noi îl configurăm. Dacă începi gratuit, treci oricând la Premium cu același site. Pachetele nu includ magazin online sau vânzare de produse.",
  },

  concepts: {
    title: "Trei afaceri. Trei direcții.",
    lead: "Trei concepte demonstrative, create de noi ca exemplu, nu site-uri de clienți. Vezi cum poate arăta un site pentru serviciile tale.",
    // Screen readers: the carousel's name.
    gallery: "Trei concepte demonstrative",
  },
} as const;
