import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

// moci: two faces from the brand's own mark. The >_< symbol is a terminal prompt, so headings, buttons, navigation and
// prices are set in a monospace made for code; paragraphs, form fields and labels are set in a face made for reading.
// Both load latin-ext for Romanian (ă, â, î, ș, ț with the comma below).

/** Headings, buttons, navigation, prices: short text with a code personality. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/** Paragraphs, form fields and labels. */
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/** Metadata, numbers and tiny labels. Pixel-perfect only at 11px and 22px. Covers ă â î ș ț. */
export const departureMono = localFont({
  src: "../fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
  weight: "400",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
