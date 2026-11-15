// Fetches every external link of the built site, as a browser would: Google Chrome follows the
// redirects, completes certificate chains and runs the "checking your browser" pages of bot walls.
// usage: node scripts/check-external.mjs <file with one URL per line>
//        (scripts/check-links.py --external writes the file from dist/ and calls this script)
// A link passes when the final answer is below 400. A 401, 403, 429 or 503 behind a bot wall
// (Cloudflare, Akamai: "Just a moment", "Access denied"...) is reported as "bot wall" and does not
// fail: the page opens in a normal browser; doi.org links that end on such a wall are checked
// through the DOI resolver's own answer instead (a redirect from doi.org proves the DOI exists).
// A file that Chrome downloads instead of showing (a PDF) is fetched again by Playwright's HTTP
// client. The source code repository of the app (github.com/tracesblanches/tracesblanches) is not
// public yet: its links are reported as "pending" and do not fail, so that the list stays visible.
// CHROME overrides /usr/bin/google-chrome. Tooling, not served.
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const urls = [...new Set(readFileSync(process.argv[2], 'utf8').split('\n').map((s) => s.trim()).filter(Boolean))].sort();
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const WALL = /just a moment|attention required|access denied|verify you are human|un instant|vérification/i;
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' });
const ctx = await browser.newContext({ userAgent: UA, locale: 'fr-FR' });
const rows = [];
let failed = 0;

const PENDING = /^https:\/\/github\.com\/tracesblanches\/tracesblanches([/#]|$)/;

async function viaHttp(url) {
  try {
    const res = await ctx.request.get(url, { timeout: 45000, maxRedirects: 10 });
    return { status: res.status(), final: res.url(), title: res.headers()['content-type'] || '' };
  } catch (e) {
    return { status: 0, final: url, title: String(e.message || e).split('\n')[0] };
  }
}

async function viaChrome(url) {
  const page = await ctx.newPage();
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    let status = res ? res.status() : 0;
    let title = await page.title().catch(() => '');
    if (status >= 400 && WALL.test(title)) {
      // Give the challenge page a chance to pass and reload the real one.
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      title = await page.title().catch(() => '');
      if (!WALL.test(title)) status = 200;
    }
    return { status, final: page.url(), title };
  } catch (e) {
    return { status: 0, final: url, title: String(e.message || e).split('\n')[0] };
  } finally {
    await page.close();
  }
}

// doi.org answers 302 to the publisher for an existing DOI and 404 for an unknown one.
async function doiExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    return { status: res.status, to: res.headers.get('location') };
  } catch (e) {
    return { status: 0, to: String(e) };
  }
}

for (const url of urls) {
  let r = await viaChrome(url);
  if (r.status === 0 && /Download is starting/.test(r.title)) r = await viaHttp(url);
  let verdict;
  if (r.status > 0 && r.status < 400) verdict = 'ok';
  else if ([401, 403, 429, 503].includes(r.status) && WALL.test(r.title)) verdict = 'bot wall';
  else if (PENDING.test(url) && r.status === 404) verdict = 'pending';
  else verdict = 'FAIL';
  if (verdict !== 'ok' && url.startsWith('https://doi.org/')) {
    const d = await doiExists(url);
    if (d.status >= 300 && d.status < 400) verdict = `ok (doi.org ${d.status} to ${d.to}; publisher page: ${r.status || 'no answer'})`;
  }
  if (verdict === 'FAIL') failed++;
  rows.push(`${verdict.startsWith('ok') ? 'ok  ' : verdict === 'bot wall' ? 'wall' : verdict === 'pending' ? 'pend' : 'FAIL'} ${String(r.status).padStart(3)} ${url}${r.final !== url ? ` -> ${r.final}` : ''}${verdict.startsWith('ok (') ? `  [${verdict}]` : ''}${verdict !== 'ok' && !verdict.startsWith('ok (') ? `  [${r.title}]` : ''}`);
}
await browser.close();
console.log(rows.join('\n'));
const n = (k) => rows.filter((r) => r.startsWith(k)).length;
console.log(`${urls.length} external links: ${n('ok')} ok, ${n('wall')} behind a bot wall, ${n('pend')} pending (repository not public yet), ${failed} failed`);
process.exit(failed ? 1 : 0);
