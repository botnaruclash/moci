"use client";

import { useEffect, useSyncExternalStore } from "react";
import styles from "./GridOverlay.module.css";

// Press G to show the site columns and the 12px / 6px cell lines.
// The choice is remembered per browser so it survives reloads.

const STORAGE_KEY = "splendessa:grid-overlay";
const CHANGE_EVENT = "splendessa:grid-overlay-change";
const MAX_COLUMNS = 12; // the widest --site-cols; narrower breakpoints hide the extra columns

let memoryFallback = false; // used when storage is blocked

function readEnabled() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "1";
  } catch {
    // storage unavailable
  }
  return memoryFallback;
}

function toggleEnabled() {
  memoryFallback = !readEnabled();
  try {
    localStorage.setItem(STORAGE_KEY, memoryFallback ? "1" : "0");
  } catch {
    // storage unavailable: the in-memory value still works for this page load
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribeEnabled(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function subscribeWidth(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  );
}

function columnVisibility(index: number) {
  if (index >= 8) return "hidden lg:block";
  if (index >= 4) return "hidden md:block";
  return "";
}

export function GridOverlay() {
  const enabled = useSyncExternalStore(subscribeEnabled, readEnabled, () => false);
  const width = useSyncExternalStore(subscribeWidth, () => window.innerWidth, () => 0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "g" || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTyping(event.target)) return;
      toggleEnabled();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className={styles.overlay}>
      <div className={`${styles.cells} site-container`} />
      <div className={`${styles.columns} site-container`}>
        <div className={`${styles.track} site-grid`}>
          {Array.from({ length: MAX_COLUMNS }, (_, index) => (
            <div key={index} className={`${styles.column} ${columnVisibility(index)}`} />
          ))}
        </div>
      </div>
      <p className={`${styles.legend} type-meta`}>
        {width}px · <span className={styles.count} /> cols · cell 12/6
      </p>
    </div>
  );
}
