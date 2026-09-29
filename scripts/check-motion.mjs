// Fails when a transition animates "all" properties. Easing and durations are
// chosen per interaction, so they are deliberately not policed here.
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const scanDir = join(root, "src");
const extensions = new Set([".css", ".ts", ".tsx", ".js", ".jsx", ".mjs"]);

const rules = [
  { pattern: /transition\s*:\s*all\b/, message: "`transition: all` — list the properties that animate" },
  { pattern: /(^|[\s"'`])transition-all(?=[\s"'`]|$)/, message: "`transition-all` — use a property-specific transition" },
];

function* files(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (extensions.has(extname(entry.name))) yield path;
  }
}

const problems = [];
for (const file of files(scanDir)) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      for (const { pattern, message } of rules) {
        if (pattern.test(line)) problems.push(`${relative(root, file)}:${index + 1}  ${message}`);
      }
    });
}

if (problems.length) {
  console.error(`check-motion: ${problems.length} problem(s)\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("check-motion: ok");
