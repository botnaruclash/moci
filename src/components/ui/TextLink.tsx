import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { ChevronChip } from "./ChevronChip";
import { externalLinkProps } from "./externalLink";
import styles from "./ui.module.css";

export function TextLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const external = externalLinkProps(href);
  return (
    <a href={href} {...external.anchor} className={cx(styles.textLink, "type-control", className)}>
      <span className={styles.textLinkLabel}>
        {children}
        {external.hint}
      </span>
      <ChevronChip />
    </a>
  );
}
