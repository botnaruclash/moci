# moci-web

One landing page at `/`, assembled from the two Splendessa copies in `~/Desktop/bytemochi-web` (used as a source
only, never modified). Extraction and arrangement only: the text, fonts, colours, logo, prices and delivery promise are
still Splendessa's. The moci rebrand has not started.

```sh
npm install
npm run dev      # http://localhost:3300
npm run check    # typecheck + lint + motion check
npm run build
```

## Sections, in order, and where each came from

| # | Section | Source |
|---|---|---|
| 1 | Hero (dusk pier scene, glass card) | `bytemochi.com` — `components/hero` |
| 2 | Form (headline, clouds, sitting figure, intake flow) | `get.bytemochi.com` — `components/campaign2` (form part of `CampaignPage`) |
| 3 | Free vs €99 Priority table | `get.bytemochi.com` — `components/campaign2` (compare part of `CampaignPage`) |
| 4 | Three demo sites (carousel on phones, detail panel) | `get.bytemochi.com` — `components/campaign2/ConceptBuilds` + `components/demos/DemoGallery` |
| 5 | CTA "Ready when you are." | `bytemochi.com` — `components/closing` |
| 6 | Footer (Launch Night) | `bytemochi.com` — `components/footer` |

The composition is in `src/app/page.tsx`; sections 2–3 are in `src/components/campaign2/LandingSections.tsx`.

## Demo mode — nothing leaves the browser

- There are no API routes and no server code. The form validates exactly as before, then answers with a reference
  made in the browser (`LOCAL-xxxxxx`). Nothing is saved, no Telegram alert, no PayPal, no Meta Pixel.
- The bar above the page and a "Demo" line on each form step say so (`src/content/demoMode.ts`).
- The €99 checkout screen shows its original disabled "Pay €99" state.

## Adapted so the single page holds together (links only, no copy changes)

- Every "Start my website" button goes to the form on this page (`#start`), not to the campaign site.
- Hero "See how it works" → the comparison table (`#compare`); there is no "How it works" section here.
- Footer nav keeps only the sections that exist: Craft → demos, Offer → table. "How it works" and "FAQ" are left out.
- `/terms` and `/privacy` do not exist here, so `content/legal.ts` marks both unpublished and nothing links to them.
- The only links leaving localhost: the three demo sites (`solv|cedar|halden.splendessa.com`), opened from the
  demo panel — Splendessa's live demos.
- No header bar: it is not one of the six sections.
