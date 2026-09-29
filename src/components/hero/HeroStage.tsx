"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Hero.module.css";

const TOUCH_LAYOUT = "(max-width: 63.999rem)";

/** The Hero's stage. On phones and tablets its height is taken once, in pixels, from what the screen gave it at load,
 *  and held there: the art's scale, its crop and the title's place are all derived from that height, and iOS — above
 *  all the in-app browsers Telegram and Instagram open links in — changes its viewport units while the toolbars slide
 *  away, which re-scaled the whole scene mid-scroll. It is measured again only when the width changes (a rotation). */
export function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    let width = -1;
    const freeze = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      stage.style.removeProperty("height");
      if (window.matchMedia(TOUCH_LAYOUT).matches) stage.style.height = `${stage.offsetHeight}px`;
    };
    freeze();
    window.addEventListener("resize", freeze);
    return () => window.removeEventListener("resize", freeze);
  }, []);

  return (
    <div ref={ref} className={styles.stage}>
      {children}
    </div>
  );
}
