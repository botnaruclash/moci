import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { ChevronChip } from "./ChevronChip";
import { externalLinkProps } from "./externalLink";
import styles from "./ui.module.css";

type ButtonLinkProps = {
  href: string;
  /** "glass" is for dark scenes. */
  variant?: "primary" | "glass";
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ href, variant = "primary", className, children }: ButtonLinkProps) {
  const external = externalLinkProps(href);
  return (
    <a
      href={href}
      {...external.anchor}
      className={cx(styles.button, variant === "glass" && styles.glass, "type-control", className)}
    >
      <span>
        {children}
        {external.hint}
      </span>
      <ChevronChip />
    </a>
  );
}
