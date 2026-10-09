import { readFile, stat } from "node:fs/promises";
import assert from "node:assert/strict";

const root = new URL("../public/assets/", import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL("manifest.json", root), "utf8"),
);
for (const entry of manifest) {
  const path = new URL(entry.file, root);
  assert.ok((await stat(path)).size > 0, `${entry.file} is empty`);
  const svg = await readFile(path, "utf8");
  assert.match(svg, /<svg\s/);
  assert.ok(
    svg.includes(`viewBox="${entry.viewBox.join(" ")}"`),
    `${entry.file}: incorrect geometry`,
  );
  assert.ok(
    !/(?:href|src)=["']https?:/i.test(svg),
    `${entry.file}: remote dependency`,
  );
  const ids = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const reference of svg.matchAll(
    /url\(#([^)]*)\)|(?:href)="#([^"]+)"/g,
  )) {
    assert.ok(
      ids.has(reference[1] || reference[2]),
      `${entry.file}: unresolved definition`,
    );
  }
}
console.log(
  `Verified ${manifest.length} non-empty local assets, viewBoxes, and SVG dependencies.`,
);
