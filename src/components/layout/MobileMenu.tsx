"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { site } from "@/content/site";
import styles from "./MobileMenu.module.css";

type MobileMenuProps = {
  id: string;
  open: boolean;
  /** Id of the section in view; its link is shown as current. */
  current: string | null;
  /** The link's href, so the header can send the reader there once the scroll lock has let go. */
  onNavigate: (href: string) => void;
};

export function MobileMenu({ id, open, current, onNavigate }: MobileMenuProps) {
  const list = useRef<HTMLUListElement>(null);

  // Opening the sheet moves focus into it — onto the list itself, not its first link. Safari on iOS draws the focus
  // ring on a link focused from script even after a tap, which left a burgundy box around "How it works" every time
  // the menu opened. The list takes focus without a ring; a keyboard user's first Tab lands on the first link.
  useEffect(() => {
    if (open) list.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <div id={id} className={styles.sheet} data-open={open} inert={!open}>
      <nav aria-label="Meniu" className={styles.inner}>
        <ul ref={list} className={styles.list} tabIndex={-1}>
          {site.nav.map((item, index) => (
            <li key={item.href} className={styles.item} style={{ "--i": index } as CSSProperties}>
              <a
                href={item.href}
                className={styles.link}
                aria-current={current !== null && item.href === `#${current}` ? "location" : undefined}
                onClick={() => onNavigate(item.href)}
              >
                <span className={`${styles.index} type-meta`} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.foot}>
          <ButtonLink href={site.cta.href} className={styles.cta}>
            {site.cta.label}
          </ButtonLink>
          <p className="type-meta">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </nav>
    </div>
  );
}
