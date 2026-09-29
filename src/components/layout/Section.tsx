import type { ReactNode } from "react";

/** "art" is an illustrated scene (the Hero): no scene colours of its own, dark header tone. */
export type Scene = "light" | "lilac" | "indigo" | "night" | "art";

const darkScenes = new Set<Scene>(["indigo", "night", "art"]);

/** A page section with a colour scene. The header reads data-tone to switch between light and dark. */
export function Section({
  id,
  scene = "light",
  className,
  children,
}: {
  id: string;
  scene?: Scene;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-section=""
      data-scene={scene}
      data-tone={darkScenes.has(scene) ? "dark" : "light"}
      className={className}
    >
      {children}
    </section>
  );
}
