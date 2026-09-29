import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Threshold } from "@/components/ui/Threshold";
import { closingCopy } from "@/content/closing";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import styles from "./Closing.module.css";
import { Statement } from "./Statement";

// S8 Closing CTA, the last light scene before Launch Night.
// Reference 2 (#contact): a centred stack — one large display element, the button beneath it, a muted centred line —
// with generous empty space around it and nothing else in the section.
// Reference 1 (footer statement): a small mark above a centred statement, one muted line, and the stepped stripes that
// hand the page to its dark ending; its button shape and chevron chip (the Phase 1 ButtonLink).
// Splendessa: the uppercase display-l statement (the blueprint's S8 type), the copy, and the dusk threshold: planes
// stacked in depth, paper → rose → burgundy → night, handing the page to Launch Night.

const { kicker, statement, line } = closingCopy;

export function Closing() {
  return (
    <Section id="review" scene="light" className={styles.section}>
      <div className={cx("site-container", styles.body)}>
        <p className={cx(styles.kicker, "type-meta")}>{kicker}</p>
        <Statement lines={statement} className={cx(styles.statement, "type-display-l")} lineClassName={styles.line} />
        <p className={cx(styles.lead, "type-lead")}>{line}</p>
        <ButtonLink href={site.cta.href} className={styles.cta}>
          {site.cta.label}
        </ButtonLink>
      </div>
      <Threshold kind="dusk" className={styles.dusk} />
    </Section>
  );
}
