import { BRAND_URL, GET_URL } from "@/lib/sites";

/** Splendessa's own sites: splendessa.com and the campaign site. Links between them stay in the same tab. */
const OWN_HOSTS = new Set([new URL(BRAND_URL).hostname, new URL(GET_URL).hostname]);

/**
 * A link to a third-party site opens in a new tab, cannot reach back through `window.opener`, and says so to a screen
 * reader. In-page links, and links to Splendessa's own sites (the "Start my website" buttons go to getsplendessa.com),
 * get none of that: they are the next step, not a detour.
 */
export function externalLinkProps(href: string) {
  const absolute = /^https?:\/\//.test(href);
  const external = absolute && !OWN_HOSTS.has(new URL(href).hostname);
  return {
    anchor: external ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {},
    hint: external ? <span className="sr-only"> (se deschide într-o filă nouă)</span> : null,
  };
}
