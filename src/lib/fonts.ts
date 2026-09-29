import { Host_Grotesk } from "next/font/google";
import localFont from "next/font/local";

/** Primary face for display and body text. */
export const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  display: "swap",
});

/** Metadata, numbers and tiny labels. Pixel-perfect only at 11px and 22px. */
export const departureMono = localFont({
  src: "../fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
  weight: "400",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
