import type { Lang, PageId } from './index';

// Interface strings shared by every page (header, footer, switch). Page text lives in the pages.
// A string missing in one language fails `astro check` (same type for both).
type UI = {
  skip: string;
  /** id of <main>, the target of the skip link (kept from the hand-written site). */
  mainId: string;
  navLabel: string;
  langLabel: string;
  onGitHub: string;
  nav: Record<Exclude<PageId, 'home'>, string>;
};

export const UI: Record<Lang, UI> = {
  en: {
    skip: 'Skip to content',
    mainId: 'content',
    navLabel: 'Main navigation',
    langLabel: 'Language',
    onGitHub: 'Traces blanches on GitHub',
    nav: { start: 'Getting started', faq: 'FAQ', privacy: 'Privacy', licences: 'Licences' },
  },
  fr: {
    skip: 'Aller au contenu',
    mainId: 'contenu',
    navLabel: 'Navigation principale',
    langLabel: 'Langue',
    onGitHub: 'Traces blanches sur GitHub',
    nav: { start: 'Démarrage', faq: 'FAQ', privacy: 'Confidentialité', licences: 'Licences' },
  },
};

export const ISSUES = 'https://github.com/tracesblanches/tracesblanches/issues';
export const ORG = 'https://github.com/tracesblanches';
