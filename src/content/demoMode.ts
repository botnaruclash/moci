// moci-web: local demo notices (DRAFT wording). The form here is not connected to anything — no database, no alerts,
// no payment, no tracking — and the call buttons have no number yet, so the page says so. Temporary.

export const demoMode = {
  bar: {
    long: "Demo local: formularul nu salvează și nu trimite nimic, iar butoanele de apel nu au încă un număr.",
    short: "Demo local · nimic nu se salvează sau trimite",
  },
  form: "Demo: nimic din ce scrii aici nu se salvează și nu se trimite.",
  result: "Demo: cererea nu a fost salvată și nu a fost trimisă.",
  /** On a call button while site.phone is not set. */
  callOff: "Demo: numărul de telefon nu e setat încă",
} as const;
