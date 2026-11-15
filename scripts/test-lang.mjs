// Language detection and memory of the bilingual site, in headless Chrome (tooling, not served).
// usage: node scripts/test-lang.mjs [site-root]      site-root defaults to dist/ (run `npm run build`
//        first); needs Chrome: CHROME overrides /usr/bin/google-chrome. Exit status 1 on failure.
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { serve } from "./pages-server.mjs";
const root = resolve(process.argv[2] || resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist"));
const PORT = 8790, B = `http://127.0.0.1:${PORT}`;
const server = await serve(root, PORT);
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome" });
let fails = 0;
const check = (name, ok, detail) => { console.log(`${ok ? "OK  " : "FAIL"} ${name}${detail ? " — " + detail : ""}`); if (!ok) fails++; };

async function ctx(opts = {}, init) {
  const c = await browser.newContext(opts);
  if (init) await c.addInitScript(init);
  const p = await c.newPage();
  const navs = [];
  p.on("framenavigated", (f) => { if (f === p.mainFrame()) navs.push(new URL(f.url()).pathname); });
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  p.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return { c, p, navs, errors };
}
const path = (p) => new URL(p.url()).pathname;
const settle = (p) => p.waitForTimeout(1500);
const langsInit = (list) => `Object.defineProperty(Navigator.prototype, "languages", { get: () => ${JSON.stringify(list)} });
  Object.defineProperty(Navigator.prototype, "language", { get: () => ${JSON.stringify(list[0])} });`;

// 1. French browser at the root: /fr/, one redirect, no loop.
{ const { c, p, navs, errors } = await ctx({ locale: "fr-FR" });
  await p.goto(B + "/"); await settle(p);
  const langs = await p.evaluate(() => navigator.languages);
  check("fr-FR at / → /fr/", path(p) === "/fr/", `languages ${JSON.stringify(langs)}, navigations ${JSON.stringify(navs)}`);
  check("fr-FR: no redirect loop (2 navigations: / then /fr/)", navs.length === 2 && navs[1] === "/fr/", JSON.stringify(navs));
  check("fr-FR: /fr/ is French", (await p.getAttribute("html", "lang")) === "fr");
  check("fr-FR: no console error", errors.length === 0, errors.join(" | "));
  await c.close(); }
// 2. English browser at the root stays.
{ const { c, p, navs } = await ctx({ locale: "en-US" });
  await p.goto(B + "/"); await settle(p);
  check("en-US at / stays on /", path(p) === "/" && navs.length === 1, JSON.stringify(navs));
  check("en-US: / is English", (await p.getAttribute("html", "lang")) === "en");
  await c.close(); }
// 3. Other language orders.
for (const [list, want] of [[["de-DE"], "/"], [["de-DE", "fr-FR", "en"], "/fr/"], [["en-GB", "fr-FR"], "/"], [["fr-CA", "en-US"], "/fr/"], [["FR"], "/fr/"], [[], "/"]]) {
  const { c, p } = await ctx({ locale: "en-US" }, langsInit(list));
  await p.goto(B + "/"); await settle(p);
  check(`languages ${JSON.stringify(list)} at / → ${want}`, path(p) === want, path(p));
  await c.close();
}
// 4. Manual choice EN from /fr/ is kept and wins over detection.
{ const { c, p, navs } = await ctx({ locale: "fr-FR" });
  await p.goto(B + "/"); await settle(p);
  await p.click(".lang a[data-lang=en]"); await settle(p);
  check("fr-FR, click EN on /fr/ → / and stays", path(p) === "/", JSON.stringify(navs));
  check("fr-FR, click EN: localStorage lang=en", (await p.evaluate(() => localStorage.getItem("lang"))) === "en");
  await p.goto(B + "/"); await settle(p);
  check("fr-FR with saved EN: / stays English on a new visit", path(p) === "/" && (await p.getAttribute("html", "lang")) === "en", path(p));
  await p.goto(B + "/fr/faq.html"); await settle(p);
  await p.click(".lang a[data-lang=en]"); await settle(p);
  check("EN switch on /fr/faq.html → /faq.html", path(p) === "/faq.html", path(p));
  await c.close(); }
// 5. Manual choice FR from an English browser is kept.
{ const { c, p } = await ctx({ locale: "en-US" });
  await p.goto(B + "/privacy.html"); await settle(p);
  await p.click(".lang a[data-lang=fr]"); await settle(p);
  check("en-US, click FR on /privacy.html → /fr/confidentialite.html", path(p) === "/fr/confidentialite.html", path(p));
  check("en-US, click FR: localStorage lang=fr", (await p.evaluate(() => localStorage.getItem("lang"))) === "fr");
  await p.goto(B + "/"); await settle(p);
  check("en-US with saved FR: / → /fr/", path(p) === "/fr/", path(p));
  await p.click(".lang a[data-lang=en]"); await settle(p);
  check("then click EN on /fr/ → / and stays", path(p) === "/", path(p));
  await c.close(); }
// 6. Shared links to a precise page are never redirected.
for (const [loc, url] of [["fr-FR", "/faq.html"], ["fr-FR", "/price.html#why"], ["fr-FR", "/licences.html"], ["en-US", "/fr/faq.html"], ["en-US", "/fr/prix.html"]]) {
  const { c, p, navs } = await ctx({ locale: loc });
  await p.goto(B + url); await settle(p);
  check(`${loc} opening ${url} is not redirected`, path(p) === url.split("#")[0] && navs.length === 1, JSON.stringify(navs));
  await c.close();
}
{ const { c, p } = await ctx({ locale: "en-US" });
  await p.evaluate(() => {}); await p.goto(B + "/faq.html"); await p.evaluate(() => localStorage.setItem("lang", "fr"));
  await p.goto(B + "/faq.html"); await settle(p);
  check("saved FR, opening /faq.html is not redirected", path(p) === "/faq.html");
  await c.close(); }
// 6b. Former technical addresses open the source code on GitHub (meta refresh), in any browser
//     language, with JavaScript on or off; GitHub itself is answered locally, not fetched.
for (const [loc, url, js] of [["fr-FR", "/getting-started.html", true], ["en-US", "/fr/demarrage.html", true], ["fr-FR", "/fr/demarrage.html", false]]) {
  const { c, p } = await ctx({ locale: loc, javaScriptEnabled: js });
  await c.route("https://github.com/**", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<title>repo</title>" }));
  await p.goto(B + url); await p.waitForURL("https://github.com/**", { timeout: 5000 }).catch(() => {});
  check(`${loc}${js ? "" : ", no JavaScript"}: ${url} → source code on GitHub`, p.url() === "https://github.com/tracesblanches/tracesblanches#readme", p.url());
  await c.close();
}
// 7. Without JavaScript: English at the root, even for a French browser.
{ const { c, p, navs } = await ctx({ locale: "fr-FR", javaScriptEnabled: false });
  await p.goto(B + "/"); await settle(p);
  check("no JavaScript, fr-FR at / → English /", path(p) === "/" && (await p.getAttribute("html", "lang")) === "en" && navs.length === 1, JSON.stringify(navs));
  await p.click(".lang a[data-lang=fr]"); await settle(p);
  check("no JavaScript: FR link still works", path(p) === "/fr/", path(p));
  await c.close(); }
// 8. Storage that throws (blocked cookies): detection still works, the switch still navigates.
{ const block = `Object.defineProperty(window, "localStorage", { get() { throw new DOMException("blocked", "SecurityError"); } });`;
  const { c, p, errors } = await ctx({ locale: "fr-FR" }, block);
  await p.goto(B + "/"); await settle(p);
  check("blocked storage, fr-FR at / → /fr/", path(p) === "/fr/", path(p));
  await p.click(".lang a[data-lang=en]"); await settle(p);
  check("blocked storage: EN click on /fr/ → / and stays (no bounce back to /fr/)", path(p) === "/", path(p));
  check("blocked storage: no page error", errors.length === 0, errors.join(" | "));
  await c.close(); }
// 8b. Coming back to / from another page of the site, with no saved choice: no detection.
{ const { c, p, navs } = await ctx({ locale: "fr-FR" });
  await p.goto(B + "/faq.html"); await settle(p);
  await p.click(".brand"); await settle(p);
  check("fr-FR, no saved choice, brand link from /faq.html → / stays English", path(p) === "/", JSON.stringify(navs));
  await c.close(); }
// 9. /fr without slash and the bilingual 404.
{ const { c, p } = await ctx({ locale: "en-US" });
  await p.goto(B + "/fr"); await settle(p);
  check("/fr redirects to /fr/", path(p) === "/fr/", path(p));
  for (const u of ["/nothing.html", "/fr/rien.html", "/en/", "/demarrage.html"]) {
    const r = await p.goto(B + u); await settle(p);
    const text = await p.textContent("main");
    const css = await p.evaluate(() => getComputedStyle(document.querySelector(".top")).borderBottomStyle);
    check(`${u} → 404 page in both languages, styled`, r.status() === 404 && text.includes("Page not found") && text.includes("Page introuvable") && css === "solid", `status ${r.status()}, css ${css}`);
  }
  await c.close(); }

console.log(fails ? `${fails} FAILED` : "all language checks passed");
await browser.close(); server.close();
process.exit(fails ? 1 : 0);
