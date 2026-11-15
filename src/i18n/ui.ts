import type { Lang, PageId } from './index';

// Interface strings shared by every page (header, footer, switch). Page text lives in the pages.
// A string missing in one language fails `astro check` (same type for both).
type UI = {
  skip: string;
  /** id of <main>, the target of the skip link (kept from the hand-written site). */
  mainId: string;
  navLabel: string;
  /** Name of the menu button of the header on a phone. */
  menu: string;
  langLabel: string;
  onGitHub: string;
  nav: Record<Exclude<PageId, 'home'>, string>;
};

export const UI: Record<Lang, UI> = {
  en: {
    skip: 'Skip to content',
    mainId: 'content',
    navLabel: 'Main navigation',
    menu: 'Menu',
    langLabel: 'Language',
    onGitHub: 'Traces Blanches on GitHub',
    nav: { start: 'Getting started', faq: 'FAQ', privacy: 'Privacy', licences: 'Licences' },
  },
  fr: {
    skip: 'Aller au contenu',
    mainId: 'contenu',
    navLabel: 'Navigation principale',
    menu: 'Menu',
    langLabel: 'Langue',
    onGitHub: 'Traces Blanches sur GitHub',
    nav: { start: 'Démarrage', faq: 'FAQ', privacy: 'Confidentialité', licences: 'Licences' },
  },
};

export const ISSUES = 'https://github.com/tracesblanches/tracesblanches/issues';
export const ORG = 'https://github.com/tracesblanches';
