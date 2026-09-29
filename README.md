# moci-web

One landing page at `/`, assembled from the two Splendessa copies in `~/Desktop/bytemochi-web` (used as a source
only, never modified), now carrying moci's Romanian copy (owner's copy, 29 Sep 2026). Still Splendessa's: the logo
(header mark, footer lockup), favicon/icons, share image, colours, fonts, illustrations, and the three demo sites
(their panel text is English).

```sh
npm install
npm run dev      # http://localhost:3300
npm run check    # typecheck + lint + motion check
npm run build
```

## Sections, in order, and where each came from

| # | Section | Source |
|---|---|---|
| – | Header (desktop pill, phone bar + full-screen menu) | `bytemochi.com` — `components/layout/Header` + `MobileMenu` |
| 1 | Hero (dusk pier scene, glass card) | `bytemochi.com` — `components/hero` |
| 2 | Form (headline, clouds, sitting figure, intake flow) | `get.bytemochi.com` — `components/campaign2` (form part of `CampaignPage`) |
| 3 | Free vs €99 Priority table | `get.bytemochi.com` — `components/campaign2` (compare part of `CampaignPage`) |
| 4 | Three demo sites (carousel on phones, detail panel) | `get.bytemochi.com` — `components/campaign2/ConceptBuilds` + `components/demos/DemoGallery` |
| 5 | CTA "Ready when you are." | `bytemochi.com` — `components/closing` |
| 6 | Footer (Launch Night) | `bytemochi.com` — `components/footer` |

The composition is in `src/app/page.tsx`; sections 2–3 are in `src/components/campaign2/LandingSections.tsx`.

## Demo mode — nothing leaves the browser

- There are no API routes and no server code. The form (business, services, site/social — optional, phone, details —
  optional) validates in the browser, then shows its confirmation. Nothing is saved, sent or tracked.
- The call buttons ("Sună pentru upgrade", "Sună-ne") have no number yet: set `site.call.phone` in
  `src/content/site.ts` and they become `tel:` links. Until then they render visibly off, marked as a demo.
- The bar above the page and a "Demo" line on each form step say so (`src/content/demoMode.ts`).
- Wording marked DRAFT in `src/content/campaign2.ts` and `demoMode.ts` (errors, the confirmation screen, demo
  notices) was not in the owner's copy and is waiting for it.

## Links and structure

- Header, mobile menu and footer: Exemple → demos, Opțiuni → table, Aplică → form (`site.nav`); the footer adds
  "Sună-ne". Every "Cere site gratuit" button goes to the form (`#start`); "Vezi exemplele" to the demos.
- Section kickers ("Start here", "Free or priority", "Concept Builds", "Next step"), the footer's CTA button and its
  "Fig. 04" caption were not in the owner's copy and are gone.
- `/terms` and `/privacy` do not exist here, so `content/legal.ts` marks both unpublished and nothing links to them.
- The only links leaving localhost: the three demo sites (`solv|cedar|halden.splendessa.com`), opened from the
  demo panel — Splendessa's live demos.
- The form, table and demo sections carry `data-section data-tone="light"` so the header turns light over them, and
  the form's scroll margin uses the header's offset.
