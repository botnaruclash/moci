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
          {/* Variant B: the supplied girl-on-cloud, opposite the heading and above the cards. Decorative. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.cloudGirl}
            src="/campaign2/girl-on-cloud.webp"
            srcSet="/campaign2/girl-on-cloud.webp 960w, /campaign2/girl-on-cloud-1440.webp 1440w"
            sizes="(min-width: 64rem) 480px, (min-width: 48rem) 360px, min(78vw, 300px)"
            alt=""
            aria-hidden="true"
            width={960}
            height={514}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.grid}>
          <DemoGallery variant="campaign" label="3 demo sites" />
        </div>
      </div>
    </section>
  );
}
