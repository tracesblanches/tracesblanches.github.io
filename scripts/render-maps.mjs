// Map images of the site, rendered by the skimap viewer (tools/viewer) with the validated
// practice styles (styles/fond|srn|guidage). Tooling, not served.
// usage: node scripts/render-maps.mjs <base-url> <outdir> <laus-fonts-route.geojson> [name ...]
//   <base-url>: `skimap serve` on the skimap repository (packs built in data/out/<site>/pack);
//   <laus-fonts-route.geojson>: written by `skimap route cervieres 44.85894,6.725006
//   44.84465,6.8157 --date 2027-01-15 --start 13:00 --out FILE`. Needs playwright-core and Chrome
//   (CHROME overrides /usr/bin/google-chrome). Then, per image, one 1600 px WebP master (Astro derives the sizes the site serves):
//   magick X.png -strip -quality 80 -define webp:method=6 src/assets/maps/NAME.webp
//   (srn-izoard → pentes-izoard, guidage-cervieres → itineraire-laus-fonts; pistes-gerardmer,
//   reseau-beille and srn-gtj keep their names; fond-chapelle, reseau-chapelle and
//   neige-cervieres are no longer on the site). The third argument may be "-" when
//   guidage-cervieres is not asked for.
// The viewer's own controls (panel, buttons, attribution, scale) are hidden by injected CSS;
// layers whose sources may not appear in a published image (CLPA, Biodiv'sports, track
// status, avalanche model fed by the CLPA) are hidden or filtered out before the shot.
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync } from "node:fs";

const [base, outdir, lausFonts, ...only] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });
// The Le Laus - Les Fonts route is only needed by guidage-cervieres ("-" skips it).
const lausLine = lausFonts && lausFonts !== "-"
  ? JSON.parse(readFileSync(lausFonts, "utf8")).features.find((f) => f.properties.kind === "route").geometry.coordinates
  : null;

const W = 960, H = 600, DPR = 1600 / 960; // 1600 × 1000 px images

const HIDE_CSS = `
  body > *:not(#map) { display: none !important; }
  #map { position: fixed !important; inset: 0 !important; }
  .maplibregl-control-container, .maplibregl-popup { display: none !important; }`;

// Sources never shown on the site.
const FORBIDDEN_SOURCES = ["avalanche-areas", "avalanche-segments", "avalanche-crossings", "avalanche-exposure", "status"];

const SHOTS = {
  "srn-izoard": { site: "cervieres", style: "srn", hash: "14.15/44.8258/6.7385", offpiste: "route-offpiste-laus-izoard", hide: ["zones", "no-network"] },
  "fond-chapelle": { site: "chapelle-des-bois", style: "fond", hash: "14.1/46.6045/6.1185" },
  "guidage-cervieres": { site: "cervieres", style: "guidage", hash: "12.62/44.8620/6.7665", route: lausLine },
  "reseau-chapelle": { site: "chapelle-des-bois", style: "srn", hash: "12.9/46.6130/6.1000", hide: ["zones"] },
  "neige-cervieres": { site: "cervieres", style: "fond", hash: "12.6/44.8560/6.7700", show: ["snow-groomed"] },
  // Other massifs (packs of build-all, public sources only).
  "pistes-gerardmer": { site: "gerardmer", style: "fond", hash: "13.3/48.0420/6.9250" },
  "reseau-beille": { site: "plateau-de-beille", style: "srn", hash: "12.4/42.7150/1.7000", hide: ["zones"] },
  "srn-gtj": { site: "srn-traversee-datatourisme-6-80785b47-1e6c-37be-99fc-d401c59b1fb7-3", style: "srn", hash: "11.8/46.4650/6.0900", hide: ["zones"] },
};

const browser = await chromium.launch({
  executablePath: process.env.CHROME || "/usr/bin/google-chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
});
for (const [name, s] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(name)) continue;
  if (s.route === null) throw new Error(`${name} needs the Le Laus - Les Fonts route file`);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const url = `${base}/tools/viewer/index.html?pack=../../data/out/${s.site}/pack/&style=${s.style}&theme=clair&panel=0#${s.hash}`;
  await page.goto(url, { waitUntil: "load" });
  await page.addStyleTag({ content: HIDE_CSS });
  await page.waitForFunction(() => window.__skimapIdle === true, null, { timeout: 120000 });
  const report = await page.evaluate(async ({ s, FORBIDDEN_SOURCES }) => {
    /* global map, setRuntime */
    const style = map.getStyle();
    const hidden = [];
    for (const l of style.layers) {
      if (FORBIDDEN_SOURCES.includes(l.source) || (s.hide || []).includes(l.source)) { map.setLayoutProperty(l.id, "visibility", "none"); hidden.push(l.id); }
      if (l.source === "zones") {
        const noBiodiv = ["!=", ["get", "kind"], "biodiv_sports"];
        map.setFilter(l.id, l.filter ? ["all", l.filter, noBiodiv] : noBiodiv);
      }
      if ((s.show || []).includes(l.source)) map.setLayoutProperty(l.id, "visibility", "visible");
    }
    // No demo position or decision: only what the caption describes.
    for (const id of ["position", "decision", "route"]) if (map.getSource(id)) setRuntime(id, []);
    if (s.route) {
      setRuntime("route", [{ type: "Feature", geometry: { type: "LineString", coordinates: s.route }, properties: { part: "ahead" } }]);
    }
    if (s.offpiste) {
      const r = await fetch(`../../data/out/${s.site}/pack/layers/${s.offpiste}.geojson`);
      const fc = await r.json();
      fc.features = fc.features.filter((f) => f.properties.kind === "route");
      map.addSource("site-route", { type: "geojson", data: fc });
      const w = (a, b) => ["interpolate", ["linear"], ["zoom"], 10, a, 16, b];
      map.addLayer({ id: "site-route-casing", type: "line", source: "site-route", layout: { "line-cap": "round", "line-join": "round" },
                     paint: { "line-color": "#ffffff", "line-width": w(7, 13) } });
      map.addLayer({ id: "site-route-line", type: "line", source: "site-route", layout: { "line-cap": "round", "line-join": "round" },
                     paint: { "line-color": "#c8007a", "line-width": w(4, 8) } });
    }
    await new Promise((r) => { map.once("idle", r); map.triggerRepaint(); });
    const rendered = map.queryRenderedFeatures();
    const leaks = rendered.filter((f) => FORBIDDEN_SOURCES.includes(f.source) || (f.source === "zones" && f.properties.kind === "biodiv_sports")).length;
    const bySource = {};
    for (const f of rendered) bySource[f.source] = (bySource[f.source] || 0) + 1;
    const visible = map.getStyle().layers.filter((l) => (l.layout || {}).visibility !== "none" && l.source).map((l) => l.source);
    return { leaks, bySource, hidden, sources: [...new Set(visible)], zoom: map.getZoom(), center: map.getCenter() };
  }, { s, FORBIDDEN_SOURCES });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outdir}/${name}.png` });
  console.log(name, JSON.stringify(report), errors.length ? "ERRORS " + errors.join(" | ") : "no console error");
  await page.close();
}
await browser.close();
