import type { Lang, PageId } from './index';

// Interface strings shared by every page (header, footer, switch, the release button). Page text
// lives in the pages. A string missing in one language fails `astro check` (same type for both).
type UI = {
  skip: string;
  /** id of <main>, the target of the skip link (kept from the hand-written site). */
  mainId: string;
  navLabel: string;
  /** Name of the menu button of the header on a phone. */
  menu: string;
  langLabel: string;
  nav: Record<Exclude<PageId, 'home'>, string>;
  /** The main button, on every page: it leads to the release issue (no form). */
  notify: string;
  /** Closing band of the pages other than the home page. */
  notifyTitle: string;
  notifyText: string;
  footer: { code: string; source: string; credits: string; site: string; ask: string; askLink: string };
};

export const UI: Record<Lang, UI> = {
  en: {
    skip: 'Skip to content',
    mainId: 'content',
    navLabel: 'Main navigation',
    menu: 'Menu',
    langLabel: 'Language',
    nav: { price: 'Price', faq: 'FAQ', privacy: 'Privacy', credits: 'Credits' },
    notify: 'Get notified of the release',
    notifyTitle: 'Follow the release',
    notifyText: 'The button opens the release page on GitHub. Follow it there to be notified when the app comes out. No form, no mailing list.',
    footer: { code: 'The code of the app is open:', source: 'source code', credits: 'Data and picture credits', site: 'Site text and images under CC BY-SA 4.0.', ask: 'A question or a mistake?', askLink: 'Ask on GitHub' },
  },
  fr: {
    skip: 'Aller au contenu',
    mainId: 'contenu',
    navLabel: 'Navigation principale',
    menu: 'Menu',
    langLabel: 'Langue',
    nav: { price: 'Prix', faq: 'FAQ', privacy: 'Confidentialité', credits: 'Crédits' },
    notify: 'Être prévenu de la sortie',
    notifyTitle: 'Suivre la sortie',
    notifyText: "Le bouton ouvre la page de la sortie sur GitHub. Suivez-la pour être prévenu quand l'app sort. Aucun formulaire, aucune liste de diffusion.",
    footer: { code: "Le code de l'app est ouvert :", source: 'code source', credits: 'Crédits des données et des images', site: 'Textes et images du site sous licence CC BY-SA 4.0.', ask: 'Une question ou une erreur ?', askLink: 'Posez-la sur GitHub' },
  },
};

export const ISSUES = 'https://github.com/tracesblanches/tracesblanches/issues';
export const RELEASE_ISSUE = 'https://github.com/tracesblanches/tracesblanches/issues/122';
