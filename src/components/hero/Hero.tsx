import { Section } from "@/components/layout/Section";
import { Threshold } from "@/components/ui/Threshold";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TextLink } from "@/components/ui/TextLink";
import { heroCopy } from "@/content/hero";
import { site } from "@/content/site";
import { HeroScene } from "./HeroScene";
import { HeroStage } from "./HeroStage";
import styles from "./Hero.module.css";

// Hero — Reference 1 composition (scene you scroll through, centred title slot, pinned glass card, stripe exit) with
// Reference 2 headline type. Phones and tablets: one still picture that scrolls away like the rest of the page.

export function Hero() {
  return (
    <Section id="top" scene="art" className={styles.hero}>
      <HeroStage>
        <HeroScene />

        <div className={styles.frame}>
          <div className={styles.titleBlock}>
            <h1 className={styles.headline}>
              {heroCopy.headline.map((line) => (
                <span key={line} className={styles.headlineLine}>
                  {line}
                </span>
              ))}
            </h1>
            <p className={styles.descriptor}>
              {heroCopy.descriptor.map((line) => (
                <span key={line} className={styles.descriptorLine}>
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className={styles.cardLane}>
            <div className={styles.card}>
              <p className="type-h3">{heroCopy.card.heading}</p>
              <p className={`${styles.condition} type-control`}>{heroCopy.card.condition}</p>
              <div className={styles.actions}>
                <ButtonLink href={site.cta.href}>{site.cta.label}</ButtonLink>
                <TextLink href={heroCopy.card.secondaryLink.href} className={styles.secondaryLink}>
                  {heroCopy.card.secondaryLink.label}
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </HeroStage>

      {/* Exit: stacked planes stepping from the art's bottom colour into the burgundy scene below. */}
      <Threshold kind="art-burgundy" />
    </Section>
  );
}
