// Screenshots of the built site (dist/) at 390 and 1280 px, light and dark, and the weight of
// each page: bytes loaded when the page opens, then after scrolling to the bottom (lazy images).
// usage: node scripts/shots.mjs <outdir> [path ...]     default paths: every page of the sitemap
//        CHROME overrides /usr/bin/google-chrome. Tooling, not served.
import { chromium } from "playwright-core";
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { serve } from "./pages-server.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [outdir, ...only] = process.argv.slice(2);
if (!outdir) { console.error("usage: node scripts/shots.mjs <outdir> [path ...]"); process.exit(2); }
mkdirSync(outdir, { recursive: true });
const sitemap = readFileSync(resolve(repo, "dist/sitemap.xml"), "utf8");
const paths = only.length ? only : [...sitemap.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
const PORT = 8791, B = `http://127.0.0.1:${PORT}`;
const server = await serve(resolve(repo, "dist"), PORT);
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome" });
const name = (p) => (p === "/" ? "en-home" : p === "/fr/" ? "fr-home" : p.replace(/^\//, "").replace(/\//g, "-").replace(/\.html$/, ""));
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const rows = [];
for (const width of [390, 1280]) {
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 800 }, deviceScaleFactor: width === 390 ? 3 : 1,
      colorScheme: scheme, isMobile: width === 390, hasTouch: width === 390, locale: "en-US" });
    for (const p of paths) {
      const page = await ctx.newPage();
      let bytes = 0; const files = [];
      page.on("response", async (r) => { try { const b = (await r.body()).length; bytes += b; files.push([new URL(r.url()).pathname, b]); } catch { /* redirect */ } });
      const errors = [];
      page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
      await page.goto(B + p, { waitUntil: "networkidle" });
      const first = bytes;
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const hero = await page.evaluate(() => { const i = document.querySelector(".hero img"); return i ? { src: new URL(i.currentSrc).pathname, w: i.clientWidth, h: i.clientHeight, natural: i.naturalWidth } : null; });
      await page.screenshot({ path: `${outdir}/${name(p)}-${width}-${scheme}-fold.png` });
      for (let y = 0; y < 30; y++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(80); }
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `${outdir}/${name(p)}-${width}-${scheme}-full.png`, fullPage: true });
      rows.push({ p, width, scheme, first, all: bytes, overflow, hero, errors, files });
      await page.close();
    }
    await ctx.close();
  }
}
for (const r of rows) {
  const h = r.hero ? ` hero ${r.hero.src.split("/").pop()} drawn ${r.hero.w}x${r.hero.h} css px, file ${r.hero.natural} px wide` : "";
  console.log(`${r.p.padEnd(26)} ${String(r.width).padStart(4)} ${r.scheme.padEnd(5)} on open ${kb(r.first).padStart(7)}, after scrolling ${kb(r.all).padStart(7)}${r.overflow > 0 ? ` OVERFLOW ${r.overflow}px` : ""}${r.errors.length ? " ERRORS " + r.errors.join(" | ") : ""}${h}`);
}
await browser.close(); server.close();
process.exit(rows.some((r) => r.overflow > 0 || r.errors.length) ? 1 : 0);
