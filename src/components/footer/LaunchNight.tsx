import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";
import { footerCopy } from "@/content/footer";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import styles from "./LaunchNight.module.css";
import { NightScene } from "./NightScene";

// Launch Night, the final scene. It begins on the night tone the Closing dusk band ends on, so the page reads
// dusk → night → footer in one continuous fall; there is no light row between them. Static throughout.
//
// Reference 1 (footer): the information sits above a full-bleed dark pixel scene, with the credits in its bottom
// corners and, on phones, a taller band and centred credits.
// Reference 2 (page end): the skyline is the last thing on the page.
// Splendessa: the supplied launch scene as the footer's stage, with the information set in its empty sky, the supplied
// logo (white lockup), and only the links this project actually has — the nav, the site CTA and the copyright.

const { line, navLabel, caption } = footerCopy;

export function LaunchNight() {
  return (
    <div data-section="" data-scene="night" data-tone="dark" className={styles.night}>
      <div className={styles.stage}>
        <div className={cx("site-container", styles.top)}>
          <div className={styles.identity}>
            <p className={styles.wordmark}>
              <Logo className={styles.logo} label={site.name} />
            </p>
            <p className={cx(styles.line, "type-lead")}>{line}</p>
          </div>

          <div className={styles.actions}>
            <nav aria-label={navLabel}>
              <ul className={styles.nav}>
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={cx(styles.navLink, "type-control")}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <ButtonLink href={site.cta.href} variant="glass" className={styles.cta}>
              {site.cta.label}
            </ButtonLink>
          </div>
        </div>

        <NightScene />
      </div>

      <div className={cx("site-container", styles.legal)}>
        {/* Departure Mono has no © glyph, so the credit line is set in the sans face, as Reference 1's is. */}
        <p className="type-small">
          © {new Date().getFullYear()} {site.name}
        </p>
        {site.legal.length > 0 ? (
          <ul className={styles.legalLinks}>
            {site.legal.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={cx(styles.legalLink, "type-meta")}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="type-meta">
          {caption.label} · {caption.text}
        </p>
      </div>
    </div>
  );
}
