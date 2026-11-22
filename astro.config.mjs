// @ts-check
import { defineConfig } from 'astro/config';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// The two language scripts, the menu and pause script (src/scripts/ui.js) and the release form's
// script (notify.js) are inlined in the pages (src/components/LangRoot.astro, LangMemory.astro,
// UiScript.astro, Notify.astro), so the
// Content-Security-Policy <meta> must allow them by hash: the hash is computed here from the
// very files that are inlined, so editing a script can never leave a stale hash behind.
/** @param {string} name @returns {`sha256-${string}`} */
const inlineScript = (name) =>
  `sha256-${createHash('sha256').update(readFileSync(new URL(`./src/scripts/${name}`, import.meta.url), 'utf8').trim()).digest('base64')}`;

// The release form (src/components/Notify.astro, src/scripts/notify.js) posts to the project's
// server and runs Cloudflare's invisible Turnstile check: the page may connect to the server's
// origin (same default as src/data/notify.ts, NOTIFY_ENDPOINT) and load Turnstile's script and
// frame from challenges.cloudflare.com.
const notifyOrigin = new URL(process.env.NOTIFY_ENDPOINT || 'https://skimap.warnier.net/v1/notify').origin;
const TURNSTILE = 'https://challenges.cloudflare.com';

// Static site for GitHub Pages at https://tracesblanches.github.io/ (base /). English at the root,
// French under /fr/. Page addresses end in .html, as on the hand-written site that came before
// (build.format 'preserve': src/pages/faq.astro -> /faq.html, src/pages/fr/index.astro -> /fr/index.html).
export default defineConfig({
  site: 'https://tracesblanches.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'preserve', inlineStylesheets: 'always' },
  compressHTML: true,
  prefetch: false,
  devToolbar: { enabled: false },
  image: { responsiveStyles: false },
  // No Markdown on the site; Shiki's inline styles would not pass the CSP.
  markdown: { syntaxHighlight: false },
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "base-uri 'self'",
        "form-action 'none'",
        "object-src 'none'",
        `connect-src 'self' ${notifyOrigin}`,
        `frame-src ${TURNSTILE}`,
      ],
      scriptDirective: {
        resources: ["'self'", TURNSTILE],
        hashes: [inlineScript('lang-root.js'), inlineScript('lang-memory.js'), inlineScript('ui.js'), inlineScript('notify.js')],
      },
    },
  },
});
