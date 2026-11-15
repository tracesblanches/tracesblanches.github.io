// Languages and page addresses. One table for the whole site: the header navigation, the
// FR | EN switch, canonical and hreflang links and the sitemap all read it, so a page and its
// counterpart can never drift apart. Addresses are those of the hand-written site that came
// before (no link breaks): English at the root, French under /fr/, pages ending in .html.

export const LOCALES = ['en', 'fr'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'en';

export const SITE = 'https://tracesblanches.github.io';

// The site is for skiers only: what it takes to install, build or contribute lives in the
// GitHub repository (README, CONTRIBUTING), linked once from the footer ("Source code").
export type PageId = 'home' | 'features' | 'get' | 'faq' | 'privacy' | 'credits';

export const PAGES: Record<PageId, Record<Lang, string>> = {
  home: { en: '/', fr: '/fr/' },
  features: { en: '/features.html', fr: '/fr/fonctionnalites.html' },
  // "Get the app": the one-time purchase (formerly "Price", at /price.html and /fr/prix.html).
  get: { en: '/get.html', fr: '/fr/obtenir.html' },
  faq: { en: '/faq.html', fr: '/fr/faq.html' },
  privacy: { en: '/privacy.html', fr: '/fr/confidentialite.html' },
  // The data credits keep the address of the former licences page.
  credits: { en: '/licences.html', fr: '/fr/licences.html' },
};

/** Pages of the header navigation, in order (the credits are in the footer). */
export const NAV: PageId[] = ['features', 'get', 'faq', 'privacy'];

/**
 * Former addresses: each is a static page with a meta refresh, a link and a canonical to its
 * target (src/components/Redirect.astro). `repo`: a technical page now in the repository;
 * `page`: a page of this site that changed address.
 */
export const REPO = 'https://github.com/tracesblanches/tracesblanches';
export const MOVED: { path: string; lang: Lang; to: string; kind: 'repo' | 'page' }[] = [
  { path: '/getting-started.html', lang: 'en', to: `${REPO}#readme`, kind: 'repo' },
  { path: '/fr/demarrage.html', lang: 'fr', to: `${REPO}#readme`, kind: 'repo' },
  { path: '/price.html', lang: 'en', to: `${SITE}/get.html`, kind: 'page' },
  { path: '/fr/prix.html', lang: 'fr', to: `${SITE}/fr/obtenir.html`, kind: 'page' },
];

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
