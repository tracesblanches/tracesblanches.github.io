// Lighthouse on the built site (dist/, served like GitHub Pages), mobile and desktop presets.
// usage: node scripts/lighthouse.mjs [path ...]     default: every page of the sitemap
// Prints the four scores, the Largest Contentful Paint (time and element) and the bytes
// transferred; fails if a score is below 98. JSON reports go to reports/lighthouse/.
// CHROME overrides /usr/bin/google-chrome. Tooling, not served.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { serve } from './pages-server.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sitemap = readFileSync(resolve(repo, 'dist/sitemap.xml'), 'utf8');
const args = process.argv.slice(2);
const paths = args.length ? args : [...sitemap.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
const PORT = 8792, B = `http://127.0.0.1:${PORT}`;
const MIN = 98;
const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];
const out = resolve(repo, 'reports/lighthouse');
mkdirSync(out, { recursive: true });
const server = await serve(resolve(repo, 'dist'), PORT);

let failed = 0;
for (const path of paths) {
  for (const preset of ['mobile', 'desktop']) {
    // A fresh Chrome and profile for every run, as Lighthouse recommends.
    const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME || '/usr/bin/google-chrome', chromeFlags: ['--headless=new', '--no-sandbox'] });
    let result;
    try {
      result = await lighthouse(B + path, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: CATS }, preset === 'desktop' ? desktopConfig : undefined);
    } finally {
      chrome.kill();
    }
    const lhr = result.lhr;
    if (lhr.runtimeError) console.error(`${path} ${preset}: runtime error ${lhr.runtimeError.code}`);
    writeFileSync(`${out}/${path.replace(/\//g, '_') || 'root'}-${preset}.json`, JSON.stringify(lhr));
    const scores = CATS.map((c) => Math.round((lhr.categories[c].score ?? 0) * 100));
    const bad = scores.some((s) => s < MIN);
    if (bad) failed++;
    const a = lhr.audits;
    const lcp = a['largest-contentful-paint']?.displayValue ?? '?';
    const lcpEl = a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.selector
      ?? a['lcp-breakdown-insight']?.details?.items?.find?.((i) => i.type === 'node')?.selector ?? '?';
    const cls = a['cumulative-layout-shift']?.displayValue ?? '?';
    const tbt = a['total-blocking-time']?.displayValue ?? '?';
    const kb = Math.round((a['total-byte-weight']?.numericValue ?? 0) / 1024);
    const low = CATS.flatMap((c) => lhr.categories[c].auditRefs.filter((r) => r.weight > 0 && a[r.id].score !== null && a[r.id].score < 1).map((r) => `${r.id} ${a[r.id].score}`));
    console.log(`${bad ? 'FAIL' : 'ok  '} ${path.padEnd(24)} ${preset.padEnd(7)} perf ${scores[0]} a11y ${scores[1]} bp ${scores[2]} seo ${scores[3]} | LCP ${lcp} (${lcpEl}) CLS ${cls} TBT ${tbt} | ${kb} KB${low.length ? ' | below 1: ' + low.join(', ') : ''}`);
  }
}
server.close();
console.log(failed ? `${failed} run(s) below ${MIN}` : `lighthouse: ${paths.length * 2} runs, every score >= ${MIN}`);
process.exit(failed ? 1 : 0);
