// Launch Night footer copy — DRAFT for layout testing only. Not approved production copy.
//
// Rules for this scene:
//  1. It closes the experience; it does not restart the sales pitch. No new positioning, offer or business claim.
//  2. Only links the project actually has: the site nav, the site CTA, the copyright. No socials, no email, no
//     address, no newsletter, no awards, no counts — none of them exist.
//  3. Legal links render only once real routes exist (see `site.legal`), so nothing here can point at a 404.
//  4. Static: the night scene is the slot for the final artwork (A3) and has no controls.

export const footerCopy = {
  /** One line under the logo. It describes this page's own arc (dawn → night), not a claim about work. */
  line: "Dawn to launch, in one page.",
  navLabel: "Footer",
  /** The scene's own caption, in the site's figure language. */
  caption: { label: "Fig. 04", text: "Launch night" },
  /** Screen-reader equivalent for the scene. */
  summary: "Illustration: the builder riding a trail of pixel blocks up to a cursor, at night.",
} as const;
