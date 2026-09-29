import { campaign, type Cell } from "@/content/campaign2";
import { demoMode } from "@/content/demoMode";
import { cx } from "@/lib/cx";
import styles from "./Campaign.module.css";
import { ChoosePlanLink } from "./ChoosePlanLink";
import { IntakeFlow } from "./IntakeFlow";
import { START_ID } from "./StartLink";

// moci-web: the form section and the comparison table, from the campaign page (get.bytemochi.com,
// components/campaign2/CampaignPage.tsx), with moci's copy. The form's headline is an <h2> (the Hero holds the <h1>);
// the section opens on the Gratuit / Premium choice (IntakeFlow), then the form. The table's cells are a check, a cross
// or the owner's words; its foot row picks a plan for the form (ChoosePlanLink), and a note closes it. The sections carry data-section and
// data-tone="light" so the header (and anchor scroll-margin) reads them as light sections, as on the brand site. The form never reaches a server.

const { hero, compare, plans } = campaign;

/** The strip above the page: in the original it said payment wasn't connected; here it says the whole form is a demo. */
export function DemoBar() {
  return (
    <p className={cx(styles.previewBar, "type-meta")}>
      <span className={styles.previewLong}>{demoMode.bar.long}</span>
      <span className={styles.previewShort}>{demoMode.bar.short}</span>
    </p>
  );
}

export function FormSection() {
  return (
    <section data-section="" data-tone="light" className={styles.hero} aria-labelledby="hero-title">
      <div className={cx("site-container", styles.heroInner)}>
        {/* Three of the same supplied cloud, at whole-number scales of its 20 × 6 grid, kept clear of the type. */}
        {(["cloudA", "cloudB", "cloudC"] as const).map((cloud) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={cloud} className={cx(styles.cloud, styles[cloud])} src="/campaign2/cloud.png" alt="" aria-hidden="true" width={20} height={6} />
        ))}
        <div className={styles.heroHead}>
          <h2 id="hero-title" className={styles.headline}>
            {hero.headline.map((line) => (
              <span key={line} className={styles.line}>
                <span>{line}</span>
              </span>
            ))}
          </h2>
          <p className={cx(styles.sub, "type-lead")}>{hero.sub}</p>
        </div>

        <div id={START_ID} className={styles.formSlot}>
          {/* The supplied sitting figure, perched on the form's top-right edge: hands on the ledge, legs over it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.sitter} src="/campaign2/sitter.webp" alt="" aria-hidden="true" width={55} height={97} />
          <IntakeFlow />
        </div>
      </div>
    </section>
  );
}

export function CompareSection() {
  return (
    <section id="compare" data-section="" data-tone="light" className={styles.compareSection} aria-labelledby="compare-title">
      <div className={cx("site-container", styles.compareInner)}>
        {/* Two of the supplied outlined cloud, at a whole-number scale of its 18 × 8 grid, either side of the heading. */}
        {(["compareCloudL", "compareCloudR"] as const).map((cloud) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={cloud} className={cx(styles.compareCloud, styles[cloud])} src="/campaign2/cloud-outline.png" alt="" aria-hidden="true" width={18} height={8} />
        ))}
        <div className={styles.compareHead}>
          <h2 id="compare-title" className="type-h2">
            {compare.title}
          </h2>
        </div>

        <div className={styles.tableWrap}>
          {/* The supplied figure holding two checks, sitting on the table's top edge where Gratuit meets Premium. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.checkGirl} src="/campaign2/checkbox-girl.webp" alt="" aria-hidden="true" width={420} height={479} loading="lazy" decoding="async" />
          <div className={styles.tableScroll} role="region" aria-labelledby="compare-title" tabIndex={0}>
            <table className={styles.compare}>
              <thead>
                <tr>
                  <th scope="col" className="type-meta">
                    {compare.columns.feature}
                  </th>
                  <th scope="col" className={cx(styles.colHead, "type-control")}>
                    <ColumnHead name={plans.free.name} price={plans.free.price} />
                  </th>
                  <th scope="col" className={cx(styles.colHead, styles.colPriority, "type-control")}>
                    <ColumnHead name={plans.premium.name} price={plans.premium.price} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row" className={styles.feature}>
                      <span className="type-body">{row.feature}</span>
                    </th>
                    <td className={styles.cell}>
                      <Value cell={row.free} />
                    </td>
                    <td className={cx(styles.cell, styles.cellPriority)}>
                      <Value cell={row.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" className={styles.feature}>
                    <span className="sr-only">{plans.heading}</span>
                  </th>
                  <td className={styles.cell}>
                    <ChoosePlanLink plan="free" />
                  </td>
                  <td className={cx(styles.cell, styles.cellPriority)}>
                    <ChoosePlanLink plan="premium" />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <p className={cx(styles.termsNote, "type-small")}>{compare.note}</p>
      </div>
    </section>
  );
}

/** "Gratuit · 0 MDL" on one line from 768px; on phones the price drops under the name and the dot goes. */
function ColumnHead({ name, price }: { name: string; price: string }) {
  return (
    <>
      {name}
      <span className={styles.colSep}> · </span>
      <span className={styles.colPrice}>{price}</span>
    </>
  );
}

/** A cell: "Da" / "—" as the pixel check or cross (their meaning in text for screen readers), or the owner's words. */
function Value({ cell }: { cell: Cell }) {
  if (typeof cell === "string") return <span className={cx(styles.cellText, "type-small")}>{cell}</span>;
  return <Mark yes={cell} />;
}

/** A pixel check or cross, drawn on the site's grid, with its meaning in text for screen readers. */
function Mark({ yes }: { yes: boolean }) {
  return (
    <span className={cx(styles.markIcon, yes ? styles.markYes : styles.markNo)}>
      <svg viewBox="0 0 7 7" width="14" height="14" shapeRendering="crispEdges" aria-hidden="true">
        {yes ? (
          <path fill="currentColor" d="M6 1h1v1H6zM5 2h1v1H5zM4 3h1v1H4zM0 3h1v1H0zM1 4h1v1H1zM3 4h1v1H3zM2 5h1v1H2z" />
        ) : (
          <path fill="currentColor" d="M1 1h1v1H1zM5 1h1v1H5zM2 2h1v1H2zM4 2h1v1H4zM3 3h1v1H3zM2 4h1v1H2zM4 4h1v1H4zM1 5h1v1H1zM5 5h1v1H5z" />
        )}
      </svg>
      <span className="sr-only">{yes ? compare.yes : compare.no}</span>
    </span>
  );
}
