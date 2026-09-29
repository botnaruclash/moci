import styles from "./Hero.module.css";

// The Hero's scene: one supplied picture — the moci mascot (the >_< slime) on a grassy hilltop above a sea of clouds,
// under a starry night (owner's art, 29 Sep 2026). A single still image that covers the stage, framed on the mascot:
// the sky carries the headline, the rocks and grass on the left the card.

export function HeroScene() {
  return (
    <div className={styles.scene}>
      {/* Plain <img>: the art must not pass through the image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/moci-night-hill.webp"
        alt=""
        className={styles.sceneImage}
        width={1536}
        height={1024}
        draggable={false}
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
