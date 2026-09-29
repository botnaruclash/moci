import { footerCopy } from "@/content/footer";
import styles from "./LaunchNight.module.css";

// The footer's artwork: the supplied launch scene — the builder riding a trail of blocks up to the cursor, on the
// night sky (master in design/footer-launch). From 48rem it is the footer's stage and the information sits in its
// empty sky; on phones it follows the information, framed on the builder and the cursor. Static, no controls.

export function NightScene() {
  return (
    <div className={styles.scene}>
      {/* The supplied picture, as supplied: a plain <img>, never the image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/footer/launch-trail.webp"
        alt={footerCopy.summary}
        className={styles.sceneImage}
        width={1540}
        height={1021}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
