import { bundle } from "lightningcss";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const input = resolve("src/styles/index.css");
const output = resolve("dist/assets/design-system.css");

const result = bundle({
  filename: input,
  minify: true,
  sourceMap: false,
  drafts: { nesting: true },
});

await mkdir(dirname(output), { recursive: true });
await writeFile(output, result.code);
console.log(`Built ${output} (${result.code.length} bytes)`);
