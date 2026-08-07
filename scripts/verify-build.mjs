import { readFile } from "node:fs/promises";

const path = "dist/assets/design-system.css";
const css = await readFile(path, "utf8");
const required = [
  "--ds-color-canvas",
  "--ds-color-accent",
  "--ds-color-focus",
  ".ds-container",
  ".ds-button",
  ".ds-card",
  ".ds-async-state",
  "prefers-reduced-motion",
];

const missing = required.filter((token) => !css.includes(token));
if (missing.length) {
  throw new Error(`Missing design-system contracts: ${missing.join(", ")}`);
}
if (css.includes("@import")) {
  throw new Error("Build output still contains unresolved @import rules");
}
if (css.length < 2000) {
  throw new Error(`Build output is unexpectedly small: ${css.length} bytes`);
}

console.log(`Verified ${path}: ${css.length} bytes, ${required.length} contracts present`);
