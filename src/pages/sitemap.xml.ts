// Sitemap with the language alternates of every page (src/i18n/index.ts).
import type { APIRoute } from 'astro';
import { PAGES, LOCALES, DEFAULT_LANG, absolute, type PageId } from '../i18n';

export const GET: APIRoute = () => {
  const urls = (Object.keys(PAGES) as PageId[]).flatMap((id) =>
    LOCALES.map((lang) => {
      const alts = LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${absolute(PAGES[id][l])}"/>`).join('\n');
      return `  <url>\n    <loc>${absolute(PAGES[id][lang])}</loc>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(PAGES[id][DEFAULT_LANG])}"/>\n  </url>`;
    }),
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
