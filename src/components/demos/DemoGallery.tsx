"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEMO_LABEL, demoCopy, demoSites, FIRST_BUILD_LABEL } from "@/content/demos";
import styles from "./DemoGallery.module.css";

// The demo gallery, shared by splendessa.com (Craft) and getsplendessa.com (below the form).
//
// Closed: three rounded cards, each only the demo's desktop hero capture, with one small label in the right-hand corner
// (the name and the explore hint), top or bottom per demo so it keeps clear of each hero's headline.
//
// Phones: an endless loop that drifts slowly. No clones: the three real cards are placed modulo the loop's length, so
// the one leaving on the left comes back on the right without a jump, and each card exists once for screen readers and
// taps. A swipe moves it (settling on a card); it holds still while touched, dragged, hovered or
// keyboard-focused, while the panel is open, after the pause button, and never moves by itself under reduced motion.
// Below it: "1 / 3" and pause / play.
// Desktop: the three side by side, no motion.
//
// First tap/click: a detail panel (native modal <dialog>) with a header ‹ × › — previous / close / next, switching demos
// inside the open panel and wrapping — then the hero image, name, build time, description and "Check it out for yourself
// ↗". The image and the CTA both go to the live demo in the same tab. Before either navigates, the open demo, carousel
// position and page scroll are saved for this tab, and coming back with Back restores them; any other arrival discards
// them.

const SPEED = 22; // px per second: a slow drift
const RESUME_AFTER = 2600; // ms after the last touch, drag or arrow
const SETTLE_MS = 320;
const GAP = 12; // matches .slide spacing on phones
const STATE_TTL = 30 * 60 * 1000;
const count = demoSites.length;
const mod = (n: number, m: number) => ((n % m) + m) % m;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Saved = { demo: number; opener: number; x: number; scrollY: number; t: number };

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

export function DemoGallery({ variant, label }: { variant: "craft" | "campaign"; label: string }) {
  const mobile = useMedia("(max-width: 47.999rem)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLLIElement | null)[]>([]);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // the visitor's own pause

  // Carousel motion, kept outside React: the offset, a settling tween, and whatever is holding it still.
  const x = useRef(0);
  const tween = useRef<{ from: number; to: number; start: number } | null>(null);
  const hold = useRef({ touch: false, hover: false, focus: false, until: 0, visible: true });
  const dragEnded = useRef(0);
  const live = useRef({ open: false, paused: false, reduced: false });
  useEffect(() => {
    live.current = { open: open !== null, paused, reduced };
  }, [open, paused, reduced]);

  const storageKey = `demo-gallery:${variant}`;

  const pitch = useCallback(() => (slides.current[0]?.offsetWidth ?? 0) + GAP, []);

  /** Place the three cards for the current offset (phones only). */
  const place = useCallback(() => {
    const p = pitch();
    const loop = p * count;
    // Each card wraps from the far left to the far right where it is out of sight on both sides (past the bleed).
    const from = -(p - GAP) - 48;
    slides.current.forEach((slide, i) => {
      if (!slide) return;
      const pos = mod(i * p - x.current - from, loop) + from;
      slide.style.transform = `translate3d(${pos}px, 0, 0)`;
    });
    const now = mod(Math.round(x.current / p), count);
    setIndex((prev) => (prev === now ? prev : now));
  }, [pitch]);

  /** Settle on card i — the nearest copy of its place in the loop — with a short ease-out. */
  const goTo = useCallback(
    (i: number) => {
      const p = pitch();
      const loop = p * count;
      const base = i * p;
      const target = base + Math.round((x.current - base) / loop) * loop;
      hold.current.until = performance.now() + RESUME_AFTER;
      if (live.current.reduced) {
        tween.current = null;
        x.current = target;
        place();
        return;
      }
      tween.current = { from: x.current, to: target, start: performance.now() };
    },
    [pitch, place],
  );

  // The loop, phones only. Desktop keeps its grid and no inline transforms.
  useEffect(() => {
    if (!mobile) {
      slides.current.forEach((slide) => slide?.style.removeProperty("transform"));
      return;
    }
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = tween.current;
      const h = hold.current;
      if (t) {
        const k = Math.min(1, (now - t.start) / SETTLE_MS);
        x.current = t.from + (t.to - t.from) * easeOut(k);
        if (k >= 1) tween.current = null;
        place();
      } else if (!(h.touch || h.hover || h.focus || now < h.until || !h.visible || live.current.open || live.current.paused || live.current.reduced)) {
        x.current += SPEED * dt;
        place();
      }
      frame = requestAnimationFrame(tick);
    };
    place();
    frame = requestAnimationFrame(tick);
    const seen = new IntersectionObserver(([entry]) => (hold.current.visible = entry?.isIntersecting ?? true));
    if (track.current) seen.observe(track.current);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [mobile, place]);

  // Swipe (touch) and drag (mouse) on the phone carousel; vertical page scrolling is left to the browser.
  useEffect(() => {
    const el = track.current;
    if (!el || !mobile) return;
    let down = false;
    let dragging = false;
    let start = 0;
    let origin = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true;
      dragging = false;
      start = lastX = e.clientX;
      lastT = performance.now();
      origin = x.current;
      velocity = 0;
      tween.current = null;
      hold.current.touch = true;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - start;
      if (!dragging && Math.abs(dx) > 6) {
        dragging = true;
        el.setPointerCapture(e.pointerId);
      }
      if (!dragging) return;
      const now = performance.now();
      velocity = (lastX - e.clientX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      x.current = origin - dx;
      place();
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      hold.current.touch = false;
      hold.current.until = performance.now() + RESUME_AFTER;
      if (!dragging) return;
      // A drag is not a tap: the card under it must not open. Settle on the nearest card, carried by the swipe.
      dragEnded.current = performance.now();
      goTo(mod(Math.round((x.current + velocity * 160) / pitch()), count));
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [mobile, goTo, pitch, place]);

  // Focus rings only for keyboard use: a tap or click never leaves one (Safari marks focus moved by script, such as
  // into the panel or back to the card, as focus-visible too). The last input decides.
  useEffect(() => {
    const set = (value: "keyboard" | "pointer") => root.current?.setAttribute("data-input", value);
    const onKey = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey && !e.altKey) set("keyboard");
    };
    const onPointer = () => set("pointer");
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, []);

  // The panel: a modal while a demo is open; the page behind holds still.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) {
      d.showModal();
      // The X takes focus first (showModal alone would focus "previous").
      d.querySelector<HTMLButtonElement>("[data-close]")?.focus();
    }
    if (open === null && d.open) d.close();
    document.documentElement.style.overflow = open !== null ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Back from a demo. If the browser kept the page (back/forward cache), the panel is simply still open and what was
  // saved is dropped. Otherwise the page loads again as a back_forward navigation and the saved state is restored.
  // Any other arrival (a fresh visit, a reload, a link) discards it, so an old panel never opens by surprise.
  useEffect(() => {
    let saved: Saved | null = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null") as Saved | null;
      sessionStorage.removeItem(storageKey);
    } catch {
      saved = null;
    }
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (!saved || nav?.type !== "back_forward" || Date.now() - saved.t > STATE_TTL) return;
    const { demo, x: offset, scrollY } = saved;
    x.current = offset;
    opener.current = mod(saved.opener, count);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
      setOpen(mod(demo, count));
    });
  }, [storageKey]);

  useEffect(() => {
    const onShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      try {
        sessionStorage.removeItem(storageKey);
      } catch {}
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, [storageKey]);

  /** Leaving for a demo (same tab, normal navigation): saved so Back can reopen this panel at this place. */
  const leave = () => {
    if (open === null) return;
    try {
      const saved: Saved = { demo: open, opener: opener.current ?? open, x: x.current, scrollY: window.scrollY, t: Date.now() };
      sessionStorage.setItem(storageKey, JSON.stringify(saved));
    } catch {}
  };

  const demo = open !== null ? demoSites[open] : null;
  const prev = open !== null ? mod(open - 1, count) : 0;
  const next = open !== null ? mod(open + 1, count) : 0;

  return (
    <div ref={root} className={styles.gallery} data-variant={variant} data-input="pointer">
      <div
        ref={track}
        className={styles.track}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") hold.current.hover = true;
        }}
        onPointerLeave={() => (hold.current.hover = false)}
        onFocus={(event) => {
          // Keyboard focus holds the loop and brings the card fully into view; a tap's focus does not hold it.
          if (root.current?.getAttribute("data-input") !== "keyboard") return;
          hold.current.focus = true;
          const i = cards.current.findIndex((card) => card === (event.target as Element));
          if (i >= 0 && mobile) goTo(i);
        }}
        onBlur={() => (hold.current.focus = false)}
      >
        <ul className={styles.list}>
          {demoSites.map((d, i) => (
            <li
              key={d.id}
              ref={(el) => {
                slides.current[i] = el;
              }}
              className={styles.slide}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              <button
                ref={(el) => {
                  cards.current[i] = el;
                }}
                type="button"
                className={styles.card}
                aria-haspopup="dialog"
                aria-label={`${d.name} — ${FIRST_BUILD_LABEL}`}
                onClick={() => {
                  if (performance.now() - dragEnded.current < 400) return;
                  opener.current = i;
                  setOpen(i);
                }}
              >
                {/* A local, optimised capture of the demo's live desktop hero. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.image} src={d.image} alt="" width={1200} height={750} decoding="async" draggable={false} />
                <span className={styles.chip} data-at={d.labelAt ?? "bottom"} aria-hidden="true">
                  <span className={styles.chipName}>{d.name}</span>
                  <span className={styles.explore}>
                    <span data-pointer="touch">{demoCopy.hintTouch}</span>
                    <span data-pointer="fine">{demoCopy.hintPointer}</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Phones: where the loop is, and pause / play. Hidden on desktop, where all three are in view. */}
      <div className={styles.controls}>
        <div className={styles.status}>
          <p className={styles.counter}>
            {index + 1} / {count}
          </p>
          {!reduced && (
            <button
              type="button"
              className={styles.pause}
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label="Pause the demo carousel"
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
            </button>
          )}
        </div>
      </div>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="demo-dialog-title"
        onClose={() => {
          setOpen(null);
          const i = opener.current;
          if (i !== null) cards.current[i]?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          // A click on the backdrop lands on the <dialog> itself, outside the panel.
          if (event.target === event.currentTarget) setOpen(null);
        }}
      >
        {demo && open !== null && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <button type="button" className={styles.panelButton} onClick={() => setOpen(prev)} aria-label={`Previous demo: ${demoSites[prev]!.name}`}>
                <Chevron back />
              </button>
              <button type="button" className={`${styles.panelButton} ${styles.panelClose}`} onClick={() => setOpen(null)} aria-label={demoCopy.close} data-close>
                <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
                  <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <button type="button" className={styles.panelButton} onClick={() => setOpen(next)} aria-label={`Next demo: ${demoSites[next]!.name}`}>
                <Chevron />
              </button>
            </div>
            {/* The image is a second way to the live demo (same tab, like the CTA). Out of the tab order and hidden from
                screen readers: for them the CTA below is the one link. */}
            <a className={styles.panelMedia} href={demo.url} onClick={leave} tabIndex={-1} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={demo.id} className={styles.panelImage} src={demo.image} alt="" width={1200} height={750} draggable={false} />
            </a>
            <div className={styles.panelBody}>
              <p className={styles.panelLabel}>{DEMO_LABEL}</p>
              <h3 id="demo-dialog-title" className={styles.panelName}>
                {demo.name}
              </h3>
              <p className={styles.panelBuild}>{FIRST_BUILD_LABEL}</p>
              <p className={styles.panelDescription}>{demo.description}</p>
              <a
                className={styles.panelLink}
                href={demo.url}
                onClick={leave}
              >
                {demoCopy.link} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 8 12" width="8" height="12" fill="none" aria-hidden="true">
      <path d={back ? "M6 1.5 1.5 6 6 10.5" : "M2 1.5 6.5 6 2 10.5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 10 12" width="10" height="12" aria-hidden="true">
      <path d="M2.5 1.5v9M7.5 1.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 10 12" width="10" height="12" aria-hidden="true">
      <path d="M2 1.4v9.2L9 6z" fill="currentColor" />
    </svg>
  );
}
