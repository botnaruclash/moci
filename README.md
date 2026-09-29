# moci-web

One landing page at `/`, assembled from the two Splendessa copies in `~/Desktop/bytemochi-web` (used as a source
only, never modified), now carrying moci's Romanian copy (owner's copy, 29 Sep 2026; full Romanian text pass on 29 Sep 2026: every visible
string, screen-reader label, the demo panel and the page metadata).

## Identity — first moci pass (29 Sep 2026)

- **Logo:** the `>_<` symbol from `bytemochi-web/Bytemochi` (symbol only, raster, extracted from one JPG; the package's
  file names still say "splendessa"). The source master's grey JPG fringe was removed (edge only, nothing inside the
  tile changed) and every size derived from it: `public/brand/moci-symbol-*.png`, `src/app/favicon.ico`, `icon1.png`,
  `icon2.png`, `apple-icon.png` (corners filled from the tile's own edge, since iOS shows transparency as black). The
  wordmark is the symbol beside "moci" set in the heading face (`components/ui/Logo.tsx`) — header and footer.
- **Share image:** `src/app/opengraph-image.png`, 1200 × 630, composed from the mark's gradient, the symbol and the
  hero's line.
- **Colours** (`src/styles/globals.css`): sampled from the mark — teal `#0c4476`, navy `#1e2165`, purple `#552785`,
  glyph white `#fcfcfc`; every other token is one of these mixed with white or black. Tokens renamed rose → lilac,
  burgundy → indigo; translucent lines use `rgb(var(--ink-rgb) / a)`. Primary buttons carry the mark's gradient.
- **Type:** JetBrains Mono (headings, buttons, nav, prices), Inter (paragraphs, form), Departure Mono kept for the
  11px pixel labels (it covers ă â î ș ț).
- **Hero seam:** the threshold under the Hero now steps from the picture's dark through navy and purple to lilac over
  paper gaps, into the light form section (it used to end on a burgundy band).
- **Hero and footer art (owner's, 29 Sep 2026):** `public/hero/moci-night-hill.webp` (the >_< mascot on a hilltop
  above the clouds, framed on the mascot at every width) and `public/footer/moci-trail.webp` (the mascot's face at the
  head of a pixel trail, on black; the footer ground is the picture's own black).
- **Form section ornaments (owner's, 29 Sep 2026):** cut from `reference/moci-form-ornaments.png` into three tight
  transparent PNGs at the sheet's own resolution (alpha made crisp, no resampling): `public/campaign2/moci-envelope.png`
  (the mochi in its envelope, on the panel's top-right edge, where the sitting figure was) and
  `moci-plane-left.png` / `moci-plane-right.png` (either side of the headline, where the pink clouds were).
- **Comparison ornaments (owner's, 29 Sep 2026):** cut the same way from `reference/moci-compare-ornaments.png`:
  `public/campaign2/moci-checks.png` (the mochi holding a white and a purple check, resting on the table's top edge
  where the Gratuit and Premium columns meet) and `moci-check-left.png` / `moci-check-right.png` (either side of the
  heading, where the outlined clouds were).
- **Demos ornament (owner's, 29 Sep 2026):** `public/campaign2/moci-folder.webp` (the mochi with a folder of site
  pages, cut from `reference/moci-demos-ornament.png`, lossless WebP), opposite the demos heading where the girl on the
  cloud was.
- **Still Splendessa's:** the three demo sites with their captures (`public/demos/*`, live on `*.splendessa.com`).

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
| 1 | Hero (night hilltop scene with the mascot, glass card) | `bytemochi.com` — `components/hero` |
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
