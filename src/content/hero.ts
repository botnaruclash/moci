// Hero copy — moci (owner's copy, 29 Sep 2026). Each string is the owner's own sentence, placed in the Hero's slots:
// the descriptor carries the first sentence (two display lines), the glass card the second sentence and the 3-hour
// condition.

export const heroCopy = {
  headline: ["Site-ul tău.", "Făcut rapid."],
  descriptor: ["Construim site-uri pentru afaceri", "de servicii din Moldova."],
  card: {
    heading: "Începi gratuit pe afacerea.moci.md.",
    condition:
      "După ce preluăm proiectul și primim materialele, îți pregătim prima versiune funcțională în aproximativ 3 ore.",
    secondaryLink: { label: "Vezi exemplele", href: "#concepts" },
  },
} as const;
