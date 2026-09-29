import { footerCopy } from "@/content/footer";
import styles from "./LaunchNight.module.css";

// The footer's artwork: the moci mascot's >_< face at the head of a trail of blue and purple pixel blocks, on black
// (owner's art, 29 Sep 2026). From 48rem it is the footer's stage and the information sits in its empty black top
// left; on phones it follows the information, framed on the mascot and the trail. Static, no controls.

export function NightScene() {
  return (
    <div className={styles.scene}>
      {/* The supplied picture, as supplied: a plain <img>, never the image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/footer/moci-trail.webp"
        alt={footerCopy.summary}
        className={styles.sceneImage}
        width={1536}
        height={1024}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
