// @ts-check
import { defineConfig } from 'astro/config';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// The two language scripts and the menu and pause script (src/scripts/ui.js) are inlined in the
// pages (src/components/LangRoot.astro, LangMemory.astro, UiScript.astro), so the
// Content-Security-Policy <meta> must allow them by hash: the hash is computed here from the
// very files that are inlined, so editing a script can never leave a stale hash behind.
/** @param {string} name @returns {`sha256-${string}`} */
const inlineScript = (name) =>
  `sha256-${createHash('sha256').update(readFileSync(new URL(`./src/scripts/${name}`, import.meta.url), 'utf8').trim()).digest('base64')}`;

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
      ],
      scriptDirective: { hashes: [inlineScript('lang-root.js'), inlineScript('lang-memory.js'), inlineScript('ui.js')] },
    },
  },
});
