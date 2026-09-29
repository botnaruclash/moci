import { cx } from "@/lib/cx";
import styles from "./ui.module.css";

export function ChevronChip({ className }: { className?: string }) {
  return (
    <span className={cx(styles.chip, className)} aria-hidden="true">
      <svg className={styles.chevron} viewBox="0 0 6 10" width="6" height="10" fill="none">
        <path d="M1.25 1.5 4.5 5 1.25 8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
