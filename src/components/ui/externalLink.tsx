import { SITE_URL } from "@/lib/sites";

/** This site's own host: links to it stay in the same tab. */
const OWN_HOSTS = new Set([new URL(SITE_URL).hostname]);

/**
 * A link to a third-party site opens in a new tab, cannot reach back through `window.opener`, and says so to a screen
 * reader. In-page links and links to this site itself get none of that: they are the next step, not a detour.
 */
export function externalLinkProps(href: string) {
  const absolute = /^https?:\/\//.test(href);
  const external = absolute && !OWN_HOSTS.has(new URL(href).hostname);
  return {
    anchor: external ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {},
    hint: external ? <span className="sr-only"> (se deschide într-o filă nouă)</span> : null,
  };
}
