// Languages and page addresses. One table for the whole site: the header navigation, the
// FR | EN switch, canonical and hreflang links and the sitemap all read it, so a page and its
// counterpart can never drift apart. Addresses are those of the hand-written site that came
// before (no link breaks): English at the root, French under /fr/, pages ending in .html.

export const LOCALES = ['en', 'fr'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'en';

export const SITE = 'https://tracesblanches.github.io';

export type PageId = 'home' | 'start' | 'faq' | 'privacy' | 'licences';

export const PAGES: Record<PageId, Record<Lang, string>> = {
  home: { en: '/', fr: '/fr/' },
  start: { en: '/getting-started.html', fr: '/fr/demarrage.html' },
  faq: { en: '/faq.html', fr: '/fr/faq.html' },
  privacy: { en: '/privacy.html', fr: '/fr/confidentialite.html' },
  licences: { en: '/licences.html', fr: '/fr/licences.html' },
};

/** Pages of the header navigation, in order. */
export const NAV: PageId[] = ['start', 'faq', 'privacy', 'licences'];

export const OTHER: Record<Lang, Lang> = { en: 'fr', fr: 'en' };

/** Native names, for the switch's accessible label. */
export const LANG_NAMES: Record<Lang, string> = { en: 'English', fr: 'Français' };

export const OG_LOCALE: Record<Lang, string> = { en: 'en_GB', fr: 'fr_FR' };

export function pagePath(id: PageId, lang: Lang): string {
  return PAGES[id][lang];
}

export function absolute(path: string): string {
  return `${SITE}${path}`;
}

/** Path of a page with a fragment, e.g. href('faq', 'fr', 'prix') -> '/fr/faq.html#prix'. */
export function href(id: PageId, lang: Lang, fragment?: string): string {
  return fragment ? `${PAGES[id][lang]}#${fragment}` : PAGES[id][lang];
}
