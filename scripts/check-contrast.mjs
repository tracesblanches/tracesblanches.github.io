// WCAG 2.2 contrast of the colour tokens, in the light and the dark scheme.
// Reads src/styles/tokens.css: the colours of the first :root block (light), the overrides of
// the prefers-color-scheme: dark block, and the pairs of the "contrast-pairs" block.
// usage: node scripts/check-contrast.mjs        Exit status 1 below a pair's minimum.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");
const vars = (block) => Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const light = vars(css.slice(css.indexOf(":root"), css.indexOf("@media")));
const darkStart = css.indexOf("@media (prefers-color-scheme: dark)");
const dark = { ...light, ...vars(css.slice(darkStart, css.indexOf("/*\ncontrast-pairs"))) };
const pairs = css.split(/^contrast-pairs.*$/m)[1].split("end-contrast-pairs")[0].trim().split("\n")
  .map((l) => l.trim().split(/\s+/)).filter((p) => p.length >= 3).map(([fg, bg, min]) => ({ fg, bg, min: +min }));

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

let fails = 0;
for (const [scheme, v] of [["light", light], ["dark", dark]]) {
  for (const { fg, bg, min } of pairs) {
    if (!v[fg] || !v[bg]) { console.log(`FAIL ${scheme}: unknown token ${v[fg] ? bg : fg}`); fails++; continue; }
    const r = ratio(v[fg], v[bg]);
    const ok = r >= min;
    if (!ok) fails++;
    console.log(`${ok ? "ok  " : "FAIL"} ${scheme.padEnd(5)} ${fg.padEnd(15)} on ${bg.padEnd(12)} ${r.toFixed(2)}:1 (min ${min})`);
  }
}
console.log(fails ? `${fails} pair(s) below the minimum` : `contrast: ${pairs.length * 2} pairs, light and dark, all at WCAG AA or above`);
process.exit(fails ? 1 : 0);
