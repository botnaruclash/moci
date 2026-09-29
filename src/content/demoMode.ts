// moci-web: local demo notices. The form here is not connected to anything — no database, no alerts, no payment, no
// tracking — so every place where the live page would act says so. Temporary, until the real backend is decided.

export const demoMode = {
  bar: {
    long: "Local demo: the form saves nothing, sends nothing and charges nothing.",
    short: "Local demo · nothing is saved or sent",
  },
  stamp: "Demo",
  form: "Demo: nothing you enter here is saved or sent anywhere.",
  result: "Demo: nothing was saved or sent. The reference is generated in your browser.",
} as const;
