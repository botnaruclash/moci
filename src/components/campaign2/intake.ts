import { campaign, type ColourDirection, type ContactMethod } from "@/content/campaign2";

export const METHODS = Object.keys(campaign.form.contact.methods) as ContactMethod[];
export const COLOUR_DIRECTIONS = Object.keys(campaign.form.colours.directions) as ColourDirection[];
export const MAX_LINKS = 6;

export type Values = {
  business: string;
  links: string[];
  offline: boolean;
  city: string;
  about: string;
  /** Selected contact methods, in the order they were picked. */
  methods: ContactMethod[];
  handles: Record<ContactMethod, string>;
  preferred: ContactMethod | null;
  colours: ColourDirection[];
  chooseColours: boolean;
  colourNote: string;
  notes: string;
};

export const emptyValues: Values = {
  business: "",
  links: [""],
  offline: false,
  city: "",
  about: "",
  methods: [],
  handles: { instagram: "", whatsapp: "", email: "" },
  preferred: null,
  colours: [],
  chooseColours: false,
  colourNote: "",
  notes: "",
};

/** Field ids that can carry an error, in the order they appear on the form. */
export type Field = "business" | "link-0" | "city" | "about" | "methods" | `handle-${ContactMethod}`;

const HANDLE = /^@?[A-Za-z0-9._]{1,30}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The essentials only: a name, one way to identify the business, one working way to reach the owner. */
export function validate(v: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (v.business.trim().length < 2) errors.business = "Add your business name.";
  if (v.offline) {
    if (!v.city.trim()) errors.city = "Add the city you work in.";
    if (v.about.trim().length < 8) errors.about = "Add a sentence about what your business does.";
  } else if (!v.links.some(findable)) {
    errors["link-0"] = "Add one link or handle — or choose “We're not online yet”.";
  }
  if (v.methods.length === 0) errors.methods = "Choose at least one way to reach you.";
  for (const method of v.methods) {
    if (!handleValid(method, v.handles[method])) {
      errors[`handle-${method}`] = {
        instagram: "Add your Instagram handle, like @yourbusiness — or untick Instagram DM.",
        whatsapp: "Add a WhatsApp number with its country code, like +351 912 345 678 — or untick WhatsApp.",
        email: "Add an email address, like you@business.com — or untick Email.",
      }[method];
    }
  }
  return errors;
}

export function findable(link: string) {
  const w = link.trim();
  return w.startsWith("@") ? w.length > 1 : w.includes(".") && w.length > 3;
}

export function handleValid(method: ContactMethod, handle: string) {
  const h = handle.trim();
  if (method === "instagram") return HANDLE.test(h);
  if (method === "whatsapp") return /^\+?[\d\s()-]+$/.test(h) && h.replace(/\D/g, "").length >= 7;
  return EMAIL.test(h);
}

/** Names the kind of link as it is typed, so the reader sees we understood it. */
export function linkKind(link: string) {
  const w = link.trim().toLowerCase();
  if (!w) return "";
  if (w.startsWith("@")) return "Handle";
  if (/instagram\.com|instagr\.am/.test(w)) return "Instagram";
  if (/tiktok\.com/.test(w)) return "TikTok";
  if (/maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps|maps\.google/.test(w)) return "Google Maps";
  if (/facebook\.com|fb\.com/.test(w)) return "Facebook";
  if (/linkedin\.com/.test(w)) return "LinkedIn";
  if (/youtube\.com|youtu\.be/.test(w)) return "YouTube";
  if (/(^|\/\/|\.)(x|twitter)\.com/.test(w)) return "X";
  if (w.includes(".")) return "Website";
  return "";
}

/** A link as its owner would recognise it: no scheme, no "www.", no trailing slash. */
export function tidyLink(link: string) {
  const w = link.trim();
  if (w.startsWith("@")) return w;
  return w.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
}

/** How the business is identified back to its owner: its first usable link, or its city. */
export function foundAt(v: Values) {
  if (v.offline) return v.city.trim() ? `${v.city.trim()} · not online yet` : "";
  const first = v.links.find(findable);
  if (!first) return "";
  const more = v.links.filter(findable).length - 1;
  return more > 0 ? `${tidyLink(first)} +${more}` : tidyLink(first);
}

/** The business name as a path segment: "Maison Lune" → "maison-lune". */
export function slug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

/** The method we would actually use: the one marked preferred, or the only one chosen. */
export function preferredMethod(v: Values): ContactMethod | null {
  if (v.preferred && v.methods.includes(v.preferred)) return v.preferred;
  return v.methods[0] ?? null;
}

export function channelName(method: ContactMethod | null) {
  return method ? campaign.form.contact.methods[method].label : "";
}

// ---- Priority: the minimum to build a first working version in 12 hours -----------------------------------------
//
// The 12 hours start when a €99 payment completes, so everything needed to start building must be known before the
// buyer pays. The minimum is:
//   1. the business name;
//   2. enough to know what the business is — a real link (website, Instagram, TikTok, Google Maps…), or the city and
//      a line about what it does. A bare "@handle" with no platform isn't enough on its own: it then needs that line;
//   3. one working way to reach the owner.
// Colours, references, logo, photos, domain and anything else are optional: they improve the result but never hold
// up or move the deadline. The same function runs on the page (before PayPal is offered) and on the server.

export type Essential = "business" | "identity" | "contact";

export function missingEssentials(v: Values): Essential[] {
  const missing: Essential[] = [];
  if (v.business.trim().length < 2) missing.push("business");
  const realLink = v.links.some((l) => findable(l) && !l.trim().startsWith("@"));
  const described = v.about.trim().length >= 8;
  const identified = v.offline ? v.city.trim().length > 0 && described : realLink || (v.links.some(findable) && described);
  if (!identified) missing.push("identity");
  if (!v.methods.some((m) => handleValid(m, v.handles[m]))) missing.push("contact");
  return missing;
}
