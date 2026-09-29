import { LaunchNight } from "@/components/footer/LaunchNight";

// The page's footer is the Launch Night scene (Phase 10). The temporary light link row it used to open with is gone:
// the footer now starts on the night tone S8's dusk band ends on, so the ending reads as one continuous fall.
export function Footer() {
  return (
    <footer id="site-footer">
      <LaunchNight />
    </footer>
  );
}
