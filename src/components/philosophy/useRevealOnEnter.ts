import { useEffect, type RefObject } from "react";

/**
 * Plays an element's entrance once. The element renders in its final state; when it is still below the fold
 * and motion is allowed, it is set to data-state="armed", then "play" once it enters (the bottom 20% of the
 * viewport excluded). Reduced motion, or a reload mid-page, leaves the final state untouched.
 */
export function useRevealOnEnter(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    el.dataset.state = "armed";
    const observer = new IntersectionObserver(
      // A batch can hold several entries for the element (e.g. [false, true]); any intersecting one counts.
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        el.dataset.state = "play";
        observer.disconnect();
      },
      // The bottom is pulled in by a fifth, so the entrance waits until the element is properly in view. The top is
      // pushed far out, so anything that has gone above the viewport still counts as intersecting: a flick or a jump
      // can take an element from below the fold to above it between two frames, and an observer watching only the
      // viewport itself gets no callback for that — which left the element armed, and therefore invisible, for good.
      { rootMargin: "200% 0px -20% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
