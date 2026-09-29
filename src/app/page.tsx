import { CompareSection, DemoBar, FormSection } from "@/components/campaign2/LandingSections";
import { ConceptBuilds } from "@/components/campaign2/ConceptBuilds";
import { Closing } from "@/components/closing/Closing";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";

// moci-web: one landing page, assembled from the two Splendessa copies in bytemochi-web, text and look unchanged.
//   Hero ............ bytemochi.com (the brand homepage's Hero)
//   Form ............ get.bytemochi.com (the campaign page's form, local demo only)
//   Comparison ...... get.bytemochi.com (Free waitlist vs €99 Priority)
//   Demos ........... get.bytemochi.com (Concept Builds: the three demo sites in the shared demo gallery)
//   CTA ............. bytemochi.com ("Ready when you are.", the Closing)
//   Footer .......... bytemochi.com (Launch Night)
export default function Home() {
  return (
    <>
      <DemoBar />
      <main id="main">
        <Hero />
        <FormSection />
        <CompareSection />
        <ConceptBuilds />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
