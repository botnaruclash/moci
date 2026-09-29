import { cx } from "@/lib/cx";
import styles from "./Threshold.module.css";

/** Which two scenes the threshold hands over between; the colours live in Threshold.module.css. */
export type ThresholdKind = "art-burgundy" | "burgundy-rose" | "dusk";

const BARS = 5;

/**
 * The seam between two scenes: a thin band of bars stepping in colour from the scene above into the one below, over
 * hairline gaps in the destination's colour (Reference 1's own transition, measured from the live site). Static.
 */
export function Threshold({ kind, className }: { kind: ThresholdKind; className?: string }) {
  return (
    <div className={cx(styles.threshold, className)} data-kind={kind} aria-hidden="true">
      {Array.from({ length: BARS }, (_, i) => (
        <span key={i} className={styles.plane} />
      ))}
    </div>
  );
}
