// moci-web: local demo notices (DRAFT wording). The form here is not connected to anything — no database, no alerts,
// no payment, no tracking — and the call buttons have no number yet, so the page says so. Temporary.

export const demoMode = {
  bar: {
    long: "Previzualizare: trimiterea formularului e simulată, datele nu se salvează și nu ajung la noi. Butoanele de apel nu au încă un număr.",
    short: "Previzualizare · formularul nu trimite nimic",
  },
  form: "Demo: trimiterea e simulată. Datele nu ajung la noi și nu te va contacta nimeni.",
  result: "Demo: cererea nu a fost trimisă.",
  /** On a call button while site.phone is not set. */
  callOff: "Demo: numărul de telefon nu e încă disponibil",
} as const;
