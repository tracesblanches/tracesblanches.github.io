// Contrast of the home hero text against the real pixels drawn behind it (picture + veil), for
// each picture of the slideshow, on a phone (390 px, portrait files), on tablets (768 px upright,
// 1024 px wide) and on computers (1280 and 1920 px), English and French home pages. Tooling, not served.
// usage: node scripts/check-hero-contrast.mjs      (run `npm run build` first; CHROME overrides
//        /usr/bin/google-chrome). Exit status 1 when a minimum is not met.
// Method: the slideshow is stopped on one picture, the hero text is made transparent (shadows
// off: they only help, they are not counted), the hero is captured, and for every line box of
// the text the BRIGHTEST background pixel is taken (worst case; the 95th percentile is printed
// too). Minimums (WCAG 2.2 AA): 4.5 for the eyebrow, the lead and the credit, 3 for the title
// (large text), 3 for the edge of the button against the picture around it and for the icon of
// the pause button against its disc.
import { chromium } from "playwright-core";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { serve } from "./pages-server.mjs";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8793, B = `http://127.0.0.1:${PORT}`;
const server = await serve(resolve(repo, "dist"), PORT);
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome" });

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const parse = (c) => c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);

const VIEWS = [
  { name: "phone 390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: "tablet 768", viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
  { name: "tablet 1024", viewport: { width: 1024, height: 768 }, isMobile: true, hasTouch: true },
  { name: "computer 1280", viewport: { width: 1280, height: 800 } },
  { name: "computer 1920", viewport: { width: 1920, height: 1080 } },
];
let fails = 0;
for (const view of VIEWS) {
  const ctx = await browser.newContext({ ...view, deviceScaleFactor: 1, bypassCSP: true, reducedMotion: "no-preference" });
  for (const path of ["/", "/fr/"]) {
    for (const slide of [0, 1]) {
      const page = await ctx.newPage();
      await page.goto(B + path, { waitUntil: "networkidle" });
      const pictures = await page.evaluate((slide) => {
        // Stop the cross-fade on one picture: 0 ms = first picture alone, 10 s = second picture fully shown.
        for (const a of document.getAnimations()) { a.pause(); a.currentTime = slide ? 10000 : 0; }
        return [...document.querySelectorAll(".hero-art img")].map((i) => new URL(i.currentSrc).pathname.split("/").pop());
      }, slide);
      await page.addStyleTag({ content: ".hero .eyebrow, .hero h1, .hero .hero-lead, .hero .btn, .hero-credit { color: transparent !important; text-shadow: none !important; } .hero-play svg { visibility: hidden; }" });
      await page.mouse.move(0, 0);
      await page.waitForTimeout(150);
      const boxes = await page.evaluate(() => {
        const lines = (el) => { const r = document.createRange(); r.selectNodeContents(el); return [...r.getClientRects()].filter((b) => b.width > 2 && b.height > 2).map((b) => ({ x: b.x, y: b.y, w: b.width, h: b.height })); };
        const box = (el) => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
        const q = (s) => document.querySelector(s);
        const credits = [...document.querySelectorAll(".hero-credit")];
        return {
          eyebrow: lines(q(".hero .eyebrow")), title: lines(q(".hero h1")), lead: lines(q(".hero .hero-lead")),
          button: box(q(".hero .btn")), play: q(".hero-play") && !q(".hero-play").hidden ? box(q(".hero-play")) : null,
          credit: credits.map((c) => getComputedStyle(c).opacity !== "0" ? lines(c) : []).flat(),
        };
      });
      const shot = await page.screenshot();
      const { data, info } = await sharp(shot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const at = (x, y) => { const i = (y * info.width + x) * 3; return lum(data[i], data[i + 1], data[i + 2]); };
      const region = (b, pad = 0) => { const out = []; for (let y = Math.max(0, Math.floor(b.y - pad)); y < Math.min(info.height, Math.ceil(b.y + b.h + pad)); y++) for (let x = Math.max(0, Math.floor(b.x - pad)); x < Math.min(info.width, Math.ceil(b.x + b.w + pad)); x++) out.push(at(x, y)); return out; };
      // Pixels between 2 and d px outside the box, its edges rounded outwards (no anti-aliased edge pixel).
      const ring = (b, d) => { const out = []; const x0 = Math.floor(b.x) - 1, x1 = Math.ceil(b.x + b.w) + 1, y0 = Math.floor(b.y) - 1, y1 = Math.ceil(b.y + b.h) + 1; for (let y = y0 - d; y < y1 + d; y++) for (let x = x0 - d; x < x1 + d; x++) if (x >= 0 && y >= 0 && x < info.width && y < info.height && !(x >= x0 && x < x1 && y >= y0 && y < y1)) out.push(at(x, y)); return out; };
      const stats = (vals) => { const s = Float64Array.from(vals).sort(); return { max: s[s.length - 1], p95: s[Math.floor(s.length * 0.95)], min: s[0] }; };
      const rows = [];
      const text = (name, fg, rects, min) => {
        if (!rects.length) return;
        const L = lum(...hex(fg));
        const worst = rects.map((r) => stats(region(r))).reduce((a, b) => (b.max > a.max ? b : a));
        rows.push([name, ratio(L, worst.max), ratio(L, worst.p95), min]);
      };
      text("eyebrow", "#f4caad", boxes.eyebrow, 4.5);
      text("title", "#f4f8fb", boxes.title, 3);
      text("lead", "#c9d6e2", boxes.lead, 4.5);
      text("credit", "#c9d6e2", boxes.credit, 4.5);
      { const L = lum(...hex("#8fc1f0")); const r = Float64Array.from(ring(boxes.button, 6), (v) => ratio(L, v)).sort(); rows.push(["button edge", r[0], r[Math.floor(r.length * 0.05)], 3]); }
      if (boxes.play) { const L = lum(...hex("#f4f8fb")); const inner = { x: boxes.play.x + 10, y: boxes.play.y + 10, w: boxes.play.w - 20, h: boxes.play.h - 20 }; const s = stats(region(inner)); rows.push(["pause icon", ratio(L, s.max), ratio(L, s.p95), 3]); }
      for (const [name, worst, p95, min] of rows) {
        const ok = worst >= min;
        if (!ok) fails++;
        console.log(`${ok ? "ok  " : "FAIL"} ${view.name.padEnd(13)} ${path.padEnd(4)} ${(slide ? pictures[1] : pictures[0]).padEnd(34)} ${name.padEnd(11)} worst ${worst.toFixed(2).padStart(5)}  p95 ${p95.toFixed(2).padStart(5)}  (min ${min})`);
      }
      await page.close();
    }
  }
  await ctx.close();
}
await browser.close(); server.close();
console.log(fails ? `${fails} contrast(s) below the minimum` : "hero contrast: every minimum met");
process.exit(fails ? 1 : 0);
