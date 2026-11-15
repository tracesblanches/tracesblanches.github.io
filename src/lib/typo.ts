import type { Lang } from '../i18n';

/**
 * French typography for text kept in .ts files: a no-break space before : ; ? ! and » and after «,
 * as in the French pages written in .astro. English text is returned as is. Safe on the HTML of
 * the copy (attributes there never hold " :" or " ?").
 */
export function typo(lang: Lang, s: string): string;
export function typo(lang: Lang, s: string | undefined): string | undefined;
export function typo(lang: Lang, s: string | undefined) {
  if (lang !== 'fr' || s === undefined) return s;
  return s.replace(/ ([:;?!»])/g, ' $1').replace(/« /g, '« ');
}
