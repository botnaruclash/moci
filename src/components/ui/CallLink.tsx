import type { ReactNode } from "react";
import { demoMode } from "@/content/demoMode";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { ChevronChip } from "./ChevronChip";
import styles from "./ui.module.css";

/**
 * A "Sună" button: a tel: link to site.call.phone. Until the owner's number is set it is never a guessed link — it
 * renders in the same place and style, visibly off, and says it is a demo (the bar above the page says so too).
 * `variant="text"` is the TextLink look (hairline + chevron); `"plain"` leaves the styling to the caller (footer nav).
 */
export function CallLink({
  variant = "text",
  className,
  children = site.call.label,
}: {
  variant?: "text" | "plain";
  className?: string;
  children?: ReactNode;
}) {
  const phone = site.call.phone;
  const body =
    variant === "text" ? (
      <>
        <span className={styles.textLinkLabel}>{children}</span>
        <ChevronChip />
      </>
    ) : (
      children
    );
  const classes = cx(variant === "text" && styles.textLink, variant === "text" && "type-control", className);

  if (phone) {
    return (
      <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={classes}>
        {body}
      </a>
    );
  }
  return (
    <a role="link" aria-disabled="true" title={demoMode.callOff} className={cx(classes, styles.callOff)}>
      {body}
      <span className="sr-only"> — {demoMode.callOff}</span>
    </a>
  );
}
