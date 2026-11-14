// Renders every Mermaid diagram in the repository's Markdown files and fails if one doesn't render.
// Usage: npm run lint:diagrams
//
// It uses the official Mermaid library in the Chrome already installed (the dev laptop and GitHub's
// Ubuntu runners both have one), so nothing heavy is installed. Mermaid is loaded from jsDelivr at a
// pinned version with a Subresource Integrity hash: the browser refuses the file if it was altered.
// To upgrade, change MERMAID_VERSION and MERMAID_SRI together (sha384 of dist/mermaid.min.js).
// Chrome: CHROME_PATH, or /usr/bin/google-chrome.

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import puppeteer from "puppeteer-core";

const MERMAID_VERSION = "12.3.0";
const MERMAID_SRI =
  "sha384-HHW54r639fK42Ip0coGF3mz8oSiGn0eEoWNTLs75X7H63pLSDBa0Tqs0RwGmLlXE";

const root = process.cwd();
const skippedDirs = new Set(["node_modules", ".git"]);

async function markdownFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skippedDirs.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await markdownFiles(path)));
    else if (entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

function mermaidBlocks(text) {
  const blocks = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "```mermaid") continue;
    const start = i + 1;
    let end = start;
    while (end < lines.length && lines[end].trim() !== "```") end++;
    blocks.push({
      line: start,
      definition: lines.slice(start, end).join("\n"),
    });
    i = end;
  }
  return blocks;
}

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome",
  // Chrome's sandbox can't start on GitHub's Ubuntu runners; the page only renders our own Markdown.
  args: ["--no-sandbox"],
});

let checked = 0;
const failures = [];
try {
  const page = await browser.newPage();
  await page.setContent(
    `<!doctype html><html><body>
      <script src="https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.min.js"
              integrity="${MERMAID_SRI}" crossorigin="anonymous"></script>
    </body></html>`,
    { waitUntil: "load" },
  );
  const loaded = await page.evaluate(
    () => typeof window.mermaid !== "undefined",
  );
  if (!loaded)
    throw new Error(
      `Mermaid ${MERMAID_VERSION} didn't load (network, or the SRI hash doesn't match).`,
    );
  await page.evaluate(() => window.mermaid.initialize({ startOnLoad: false }));

  for (const file of await markdownFiles(root)) {
    for (const block of mermaidBlocks(await readFile(file, "utf8"))) {
      checked++;
      const error = await page.evaluate(
        async (definition, id) => {
          try {
            await window.mermaid.render(id, definition);
            return null;
          } catch (e) {
            return String(e?.message ?? e)
              .split("\n")
              .slice(0, 4)
              .join("\n    ");
          }
        },
        block.definition,
        `diagram-${checked}`,
      );
      if (error)
        failures.push(`${relative(root, file)}:${block.line}: ${error}`);
    }
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error(`${failures.length} of ${checked} diagrams failed to render:`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`All ${checked} diagrams render (Mermaid ${MERMAID_VERSION}).`);
