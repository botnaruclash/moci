import { cx } from "@/lib/cx";
import styles from "./ui.module.css";

// moci's logo, first identity pass (29 Sep 2026). The supplied package (bytemochi-web/Bytemochi) holds the >_< symbol
// only, as rasters extracted from one JPG — no wordmark and no vector — so the lockup is the symbol as supplied
// (02-rounded-square/web, copied to /brand as moci-symbol-*.png; it carries its own gradient tile, so it reads on light
// and dark scenes alike) beside the name "moci" set as text in the heading face. The name takes `currentColor`.
// Size it with `font-size` on the caller: the symbol is 1.25em square and the name is 1em.

export function Logo({ className, label }: { className?: string; label?: string }) {
  return (
    <span className={cx(styles.logo, className)} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.logoSymbol} src="/brand/moci-symbol-256.png" alt="" width={256} height={256} />
      <span className={styles.logoName} aria-hidden="true">
        moci
      </span>
    </span>
  );
}
