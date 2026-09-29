import { DemoGallery } from "@/components/demos/DemoGallery";
import { campaign } from "@/content/campaign2";
import { cx } from "@/lib/cx";
import styles from "./Concepts.module.css";

// Concept Builds: the three demo sites in the shared demo gallery (components/demos, also on splendessa.com's Craft),
// in the page's rounded cards: a carousel on phones, three side by side on desktop, a detail panel on the first tap.

const { concepts } = campaign;

export function ConceptBuilds() {
  return (
    <section id="concepts" data-section="" data-tone="light" className={styles.section} aria-labelledby="concepts-title">
      <div className="site-container">
        <div className={styles.intro}>
          <div className={styles.head}>
            <h2 id="concepts-title" className="type-h2">
              {concepts.title}
            </h2>
            <p className={cx(styles.lead, "type-body")}>{concepts.lead}</p>
          </div>
          {/* moci: the mochi with a folder of site pages, opposite the heading and above the cards. Decorative (cut from
              reference/moci-demos-ornament.png). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.mochiFolder}
            src="/campaign2/moci-folder.webp"
            alt=""
            aria-hidden="true"
            width={1277}
            height={855}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.grid}>
          <DemoGallery variant="campaign" label={concepts.gallery} />
        </div>
      </div>
    </section>
  );
}
