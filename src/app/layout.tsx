import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GridOverlay } from "@/components/dev/GridOverlay";
import { departureMono, hostGrotesk } from "@/lib/fonts";
import { labEnabled } from "@/lib/lab";
import { GET_URL } from "@/lib/sites";
import "@/styles/globals.css";

// The page was held out of the index through the build — `robots: { index: false, follow: false }` — which was right
// while it was unfinished and wrong the moment it started being shown to people. It is indexable now. /lab keeps its
// own noindex, because that is scaffolding and not part of the site.
// The absolute base for the share card and the canonical link: this site's origin (lib/sites.ts).
const SITE = GET_URL;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  alternates: { canonical: "/" },
  title: { default: "moci — Site-ul tău. Făcut rapid.", template: "%s · moci" },
  // Taken from the Hero, so the search result says what the page says.
  description: "Site-uri de prezentare pentru afaceri de servicii din Moldova. Începi gratuit pe afacerea.moci.md sau alegi Premium, cu domeniul tău și rezervări online.",
  // opengraph-image.png beside this file is picked up automatically, and is what a link to the site shows when it
  // is pasted into a chat — which, with a video pointing at it, is most of how it will first be seen. Without it
  // the preview was a bare line of text.
  openGraph: {
    type: "website",
    url: "/",
    siteName: "moci",
    title: "moci — Site-ul tău. Făcut rapid.",
    description: "Site-uri de prezentare pentru afaceri de servicii din Moldova. Începi gratuit pe afacerea.moci.md sau alegi Premium, cu domeniul tău și rezervări online.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro" className={`${hostGrotesk.variable} ${departureMono.variable}`}>
      <body data-scene="light">
        {children}
        {labEnabled && <GridOverlay />}
      </body>
    </html>
  );
}
