// Map of France for the home page: the Nordic ski areas of the census and the Nordic
// backcountry areas and traverses found outside resorts, on the outline of the departments.
// An ice-blue ring marks each one whose pack is already built (catalog state built or
// built_outside_build_all; an area cut into sections, when every section is built).
// usage: node scripts/render-france.mjs <catalog.geojson> <departements.geojson> <out.png>
//   <catalog.geojson>: data/out/france/catalog.geojson of the project repository (census);
//   <departements.geojson>: Etalab administrative outlines, departements-1000m.geojson
//   (Licence Ouverte, from IGN Admin Express). Writes a 2400 × 2300 px PNG. Tooling, not served.
import { readFileSync } from "node:fs";
import sharp from "sharp";

const [catPath, depPath, out] = process.argv.slice(2);
const cat = JSON.parse(readFileSync(catPath, "utf8"));
const dep = JSON.parse(readFileSync(depPath, "utf8"));
// Metropolitan France only (codes 01-95, 2A, 2B).
const metro = dep.features.filter((f) => /^(\d\d|2A|2B)$/.test(f.properties.code) && f.properties.code < "97");
// Lambert-like simple projection: x = lon * cos(46.5°), y = lat.
const k = Math.cos((46.5 * Math.PI) / 180);
const W = 2400, H = 2300, LON0 = -5.2, LON1 = 9.7, LAT0 = 41.3, LAT1 = 51.15;
const sx = (H * 0.94) / (LAT1 - LAT0), sy = sx;
const ox = (W - (LON1 - LON0) * k * sx) / 2, oy = (H - (LAT1 - LAT0) * sy) / 2;
const px = ([lon, lat]) => [ox + (lon - LON0) * k * sx, oy + (LAT1 - lat) * sy];
const rings = (g) => (g.type === "Polygon" ? [g.coordinates] : g.coordinates);
const inside = (pt, poly) => { let c = false; for (const ring of poly) for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
  const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };
const inFrance = (pt) => metro.some((f) => rings(f.geometry).some((poly) => inside(pt, poly)));
const path = (poly) => poly.map((ring) => "M" + ring.map((p) => px(p).map((v) => v.toFixed(1)).join(",")).join("L") + "Z").join("");
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#0b1621"/>`;
svg += `<g fill="#18283a" stroke="#2c4258" stroke-width="2" stroke-linejoin="round">${metro.map((f) => `<path d="${rings(f.geometry).map(path).join("")}"/>`).join("")}</g>`;
const feats = cat.features.filter((f) => f.properties.center && inFrance(f.properties.center));
const n = { nordic_station: 0, srn_area: 0, traverse: 0 };
for (const f of feats) n[f.properties.kind]++;
const BUILT = new Set(["built", "built_outside_build_all"]);
const parts = (id) => cat.features.filter((f) => f.properties.parent === id);
const isBuilt = (f) => f.properties.build?.state === "sections"
  ? parts(f.properties.id).length > 0 && parts(f.properties.id).every(isBuilt)
  : BUILT.has(f.properties.build?.state);
// Sections are drawn through their parent.
const built = feats.filter((f) => !f.properties.parent && isBuilt(f));
// Backcountry areas and traverses: their outline; stations: a dot.
svg += `<g fill="rgba(245,164,98,.35)" stroke="#f5a462" stroke-width="3">${feats.filter((f) => f.properties.kind !== "nordic_station").map((f) => `<path d="${rings(f.geometry).map(path).join("")}"/>`).join("")}</g>`;
svg += `<g fill="#f4f8fb" stroke="#0b1621" stroke-width="3">${feats.filter((f) => f.properties.kind === "nordic_station").map((f) => { const [x, y] = px(f.properties.center); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/>`; }).join("")}</g>`;
svg += `<g fill="none" stroke="#8fc1f0" stroke-width="5">${built.map((f) => { const [x, y] = px(f.properties.center); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="19"/>`; }).join("")}</g></svg>`;
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
const nb = (k) => built.filter((f) => f.properties.kind === k).length;
console.log(`${out}: ${n.nordic_station} Nordic ski areas, ${n.srn_area} backcountry areas, ${n.traverse} traverses inside metropolitan France; packs built: ${nb("nordic_station")} areas, ${nb("srn_area")} backcountry areas, ${nb("traverse")} traverses`);
