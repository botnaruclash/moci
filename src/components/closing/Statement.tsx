"use client";

import { useRef, type CSSProperties } from "react";
import { useRevealOnEnter } from "@/components/philosophy/useRevealOnEnter";

/** The closing statement. Each line rises once inside its own mask when the heading is first scrolled into view. */
export function Statement({
  lines,
  className,
  lineClassName,
}: {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useRevealOnEnter(ref);
  return (
    <h2 ref={ref} className={className}>
      {lines.map((text, index) => (
        <span key={text} className={lineClassName} style={{ "--i": index } as CSSProperties}>
          <span>{text}</span>{" "}
        </span>
      ))}
    </h2>
  );
}
