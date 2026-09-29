"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { site } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

type Tone = "light" | "dark";

const DESKTOP = "(min-width: 64rem)";

/** Reports the tone and id of the section currently behind the header. */
function useSectionBehindHeader(initialTone: Tone) {
  const [state, setState] = useState<{ tone: Tone; section: string | null }>({ tone: initialTone, section: null });

  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    const observe = () => {
      observer?.disconnect();
      // A 1px line through the middle of the header: 30px on the phone bar, 43px on the desktop pill.
      const line = window.matchMedia(DESKTOP).matches ? 43 : 30;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target as HTMLElement;
            setState({ tone: target.dataset.tone === "dark" ? "dark" : "light", section: target.id || null });
          }
        },
        { rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px` },
      );
      document.querySelectorAll("[data-section]").forEach((section) => observer?.observe(section));
    };

    observe();
    window.addEventListener("resize", observe);
    return () => {
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, []);

  return state;
}

/** `initialTone` is the tone at first paint, before the observer runs: the tone of the page's first section. */
export function Header({ initialTone = "light" }: { initialTone?: Tone }) {
  const { tone, section } = useSectionBehindHeader(initialTone);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  /** Set when the menu is closing because a link in it was followed, so the lock sends the reader on rather than back. */
  const goingTo = useRef<string | null>(null);

  // While the menu is open: the rest of the page is inert, scrolling is locked, Esc closes it,
  // and widening to desktop closes it.
  useEffect(() => {
    if (!open) return;
    const background = ["skip-link", "main", "site-footer"].map((id) => document.getElementById(id));
    background.forEach((element) => element?.setAttribute("inert", ""));

    // The lock pins the body and puts the offset back on the way out, rather than setting overflow on <html>.
    // iOS Safari does not honour that for touch scrolling — and worse, clearing it again can leave the document
    // unable to scroll at all, which strands the reader on whatever section they were on with the page refusing
    // every swipe. Pinning the body is the one lock that holds there and lets go cleanly.
    const { body } = document;
    const offset = window.scrollY;
    const pinned = { position: body.style.position, top: body.style.top, left: body.style.left,
                     right: body.style.right, width: body.style.width };
    body.style.position = "fixed";
    body.style.top = `-${offset}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    const desktop = window.matchMedia(DESKTOP);
    const onBreakpoint = () => desktop.matches && setOpen(false);

    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      background.forEach((element) => element?.removeAttribute("inert"));
      Object.assign(body.style, pinned);
      // The body was pinned while the sheet was open, so the anchor jump behind a tapped link had nowhere to land.
      // With the pin released the destination is reachable, and its scroll-margin clears the header. Otherwise the
      // reader simply goes back where they were — instantly, since the page scrolls smoothly by default.
      const destination = goingTo.current && document.querySelector(goingTo.current);
      goingTo.current = null;
      if (destination) destination.scrollIntoView();
      else window.scrollTo({ top: offset, behavior: "instant" });
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const toggleMenu = () => {
    if (open) menuButton.current?.focus();
    setOpen(!open);
  };

  return (
    <header className={styles.header} data-tone={open ? "light" : tone}>
      <nav aria-label="Primary" className={styles.bar}>
        <Link
          href="/"
          className={styles.logo}
          aria-label={`${site.name}, home`}
          onClick={(event) => {
            // Already on the homepage, a link to "/" is not a navigation, so nothing would move. Take the reader back
            // to the top instead, and drop any #section from the address.
            if (window.location.pathname !== "/") return;
            event.preventDefault();
            if (open) {
              // The open sheet pins the page; closing it sends the reader to the Hero (see the lock above).
              goingTo.current = "#top";
              setOpen(false);
              history.replaceState(null, "", "/");
              return;
            }
            const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: still ? "instant" : "smooth" });
            history.replaceState(null, "", "/");
          }}
        >
          <span className={styles.logoMark} aria-hidden="true" />
        </Link>

        <ul className={styles.links}>
          {site.headerNav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={`${styles.link} type-control`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <ButtonLink href={site.cta.href}>{site.cta.label}</ButtonLink>
          <button
            ref={menuButton}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
          >
            <span className={styles.menuIcon} data-open={open} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </nav>

      <MobileMenu
        id="mobile-menu"
        open={open}
        current={section}
        onNavigate={(href) => {
          goingTo.current = href;
          setOpen(false);
          // The sheet is gone; focus belongs on the control that opened it, not on nothing.
          menuButton.current?.focus();
        }}
      />
    </header>
  );
}
