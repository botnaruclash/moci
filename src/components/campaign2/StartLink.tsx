"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { ChevronChip } from "@/components/ui/ChevronChip";
import styles from "./Campaign.module.css";

export const START_ID = "start";

/** Brings the intake form into view and puts the cursor in its first empty field. Without script it is a plain anchor. */
export function StartLink({ tone = "ink", className, children }: { tone?: "ink" | "paper"; className?: string; children: ReactNode }) {
  return (
    <a
      href={`#${START_ID}`}
      className={cx(styles.start, tone === "paper" && styles.startPaper, "type-control", className)}
      onClick={(event) => {
        const section = document.getElementById(START_ID);
        if (!section) return;
        event.preventDefault();
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
        // The first empty field, or the flow's own heading once the form is done.
        const target =
          section.querySelector<HTMLElement>("input:not([type=radio]):not([type=checkbox]):placeholder-shown, textarea:placeholder-shown") ??
          section.querySelector<HTMLElement>("[data-flow-heading]");
        target?.focus({ preventScroll: true });
        history.replaceState(null, "", `#${START_ID}`);
      }}
    >
      <span>{children}</span>
      <ChevronChip />
    </a>
  );
}
