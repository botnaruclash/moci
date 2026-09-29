import styles from "./Hero.module.css";

// The Hero's scene: one supplied picture — dusk over the water, the builder on the pier holding up a lit block
// (master in design/hero-dusk). It replaces the layered A1 scene (background, foreground, figure) with a single still
// image that covers the stage, framed on the builder: her sky carries the headline, the pier the card.

export function HeroScene() {
  return (
    <div className={styles.scene}>
      {/* Plain <img>: the art must not pass through the image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/dusk-pier.webp"
        alt=""
        className={styles.sceneImage}
        width={1484}
        height={1060}
        draggable={false}
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
