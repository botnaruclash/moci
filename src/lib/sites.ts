// This site's public origin: the base for the canonical link, Open Graph URLs and the share image. It defaults to the
// production domain, so a build never publishes a localhost address; set NEXT_PUBLIC_SITE_URL to override it (for
// example on a preview deployment).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://moci.md").replace(/\/$/, "");
