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
| 2 | Choice + form (headline, clouds, sitting figure; Gratuit / Premium cards, then the form) | `get.bytemochi.com` — `components/campaign2` (form part of `CampaignPage`) |
| 3 | Gratuit · 0 MDL vs Premium · 1.999 MDL table | `get.bytemochi.com` — `components/campaign2` (compare part of `CampaignPage`) |
| 4 | Three demo sites (carousel on phones, detail panel) | `get.bytemochi.com` — `components/campaign2/ConceptBuilds` + `components/demos/DemoGallery` |
| 5 | CTA "Ready when you are." | `bytemochi.com` — `components/closing` |
| 6 | Footer (Launch Night) | `bytemochi.com` — `components/footer` |

The composition is in `src/app/page.tsx`; sections 2–3 are in `src/components/campaign2/LandingSections.tsx`.

## Demo mode — nothing leaves the browser

- There are no API routes and no server code. The section opens on two cards, Gratuit · 0 MDL and Premium · 1.999 MDL
  (`campaign.plans` in `src/content/campaign2.ts`). Choosing one shows the same form for both (business, services,
  site/social — optional, phone, details — optional) with the chosen plan kept on top as a switch; switching never
  clears what was typed. Sending validates in the browser and then says plainly that the request was not saved and
  not sent, with a way back to the form. Nothing is saved, sent or tracked; no payment, checkout or €-pricing remains.
- The table's foot row ("Alege" / "Alege Gratuit", "Alege Premium") selects that plan and brings the form into view
  (`ChoosePlanLink` → a `moci:choose-plan` window event that `IntakeFlow` listens for).
- The call buttons ("Sună-ne") have no number yet: set `site.call.phone` in
  `src/content/site.ts` and they become `tel:` links. Until then they render visibly off, marked as a demo.
- The bar above the page and a "Demo" line on each form step say so (`src/content/demoMode.ts`).
- Wording marked DRAFT in `src/content/campaign2.ts` and `demoMode.ts` (errors, the confirmation screen, demo
  notices) was not in the owner's copy and is waiting for it.

## Links and structure

- Header, mobile menu and footer: Exemple → demos, Opțiuni → table, Aplică → form (`site.nav`); the footer adds
  "Sună-ne". Every "Cere site gratuit" button goes to the start of the choice (`#start`); "Vezi exemplele" to the demos.
- Section kickers ("Start here", "Free or priority", "Concept Builds", "Next step"), the footer's CTA button and its
  "Fig. 04" caption were not in the owner's copy and are gone.
- `/terms` and `/privacy` do not exist here, so `content/legal.ts` marks both unpublished and nothing links to them.
- The only links leaving localhost: the three demo sites (`solv|cedar|halden.splendessa.com`), opened from the
  demo panel — Splendessa's live demos.
- The form, table and demo sections carry `data-section data-tone="light"` so the header turns light over them, and
  the form's scroll margin uses the header's offset.
