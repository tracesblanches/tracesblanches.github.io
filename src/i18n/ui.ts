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
  /** The main button, on every page: it leads to the release form (#notify, Notify.astro). */
  notify: string;
  /** Closing band of the pages: the release form. */
  notifyTitle: string;
  notifyText: string;
  form: {
    email: string;
    consent: string;
    submit: string;
    /** Label of the hidden honeypot field (read by no one but robots). */
    honeypot: string;
    noscript: string;
    privacy: string;
    /** Discreet link under the form to the release issue on GitHub ([`RELEASE_ISSUE`]). */
    github: string;
    /** Anchor of the release-list section of the privacy page. */
    privacyAnchor: string;
    /** Messages of src/scripts/notify.js, by server error code. */
    messages: Record<'email' | 'consent' | 'check' | 'sending' | 'done' | 'unsubscribe' | 'invalid_email' | 'consent_required' | 'turnstile' | 'verification_required' | 'verification_failed' | 'verification_unavailable' | 'rate_limited' | 'network' | 'server', string>;
  };
  footer: { code: string; source: string; credits: string; site: string; ask: string; askLink: string };
};

export const UI: Record<Lang, UI> = {
  en: {
    skip: 'Skip to content',
    mainId: 'content',
    navLabel: 'Main navigation',
    menu: 'Menu',
    langLabel: 'Language',
    nav: { features: 'Features', get: 'Get the app', faq: 'FAQ', privacy: 'Privacy', credits: 'Sources and credits' },
    notify: 'Get notified of the release',
    notifyTitle: 'Get notified of the release',
    notifyText: 'Leave your e-mail address: you will get a single message when the app comes out, then your address is deleted.',
    form: {
      email: 'E-mail address',
      consent: 'I agree to receive a single message when the app is released; I can unsubscribe at any time.',
      submit: 'Notify me',
      honeypot: 'Leave this field empty',
      noscript: 'This form needs JavaScript for its anti-robot check.',
      privacy: 'What we keep and for how long',
      github: 'or follow the release on GitHub',
      privacyAnchor: 'release',
      messages: {
        email: 'Enter a valid e-mail address, such as name@example.org.',
        consent: 'Tick the box to agree to the release message.',
        check: 'Anti-robot check…',
        sending: 'Sending…',
        done: 'Noted: you will get a single message when the app comes out.',
        unsubscribe: 'Unsubscribe link (keep it to leave before the release)',
        invalid_email: 'This e-mail address is not valid.',
        consent_required: 'Tick the box to agree to the release message.',
        turnstile: 'The anti-robot check did not succeed. Try again in a moment.',
        verification_required: 'The anti-robot check did not succeed. Try again in a moment.',
        verification_failed: 'The anti-robot check did not succeed. Try again in a moment.',
        verification_unavailable: 'Sign-up is not available right now. Try again later.',
        rate_limited: 'Too many attempts from your connection. Try again in an hour.',
        network: 'The server could not be reached. Check your connection and try again.',
        server: 'Something went wrong on the server. Try again later.',
      },
    },
    footer: { code: 'All the work on the app is public:', source: 'see it on GitHub', credits: 'Sources and credits', site: 'Site text and images under CC BY-SA 4.0.', ask: 'A question or a mistake?', askLink: 'Ask on GitHub' },
  },
  fr: {
    skip: 'Aller au contenu',
    mainId: 'contenu',
    navLabel: 'Navigation principale',
    menu: 'Menu',
    langLabel: 'Langue',
    nav: { features: 'Fonctionnalités', get: "Obtenir l'app", faq: 'FAQ', privacy: 'Confidentialité', credits: 'Sources et crédits' },
    notify: 'Être prévenu de la sortie',
    notifyTitle: 'Être prévenu de la sortie',
    notifyText: "Laissez votre adresse e-mail : vous recevrez un seul message, à la sortie de l'app, puis votre adresse sera effacée.",
    form: {
      email: 'Adresse e-mail',
      consent: "J'accepte de recevoir un seul message à la sortie de l'app ; je peux me désinscrire à tout moment.",
      submit: 'Me prévenir',
      honeypot: 'Laissez ce champ vide',
      noscript: 'Ce formulaire a besoin de JavaScript pour sa vérification anti-robot.',
      privacy: 'Ce que nous gardons et combien de temps',
      github: 'ou suivez la sortie sur GitHub',
      privacyAnchor: 'sortie',
      messages: {
        email: 'Saisissez une adresse e-mail valide, par exemple nom@exemple.fr.',
        consent: 'Cochez la case pour accepter le message de sortie.',
        check: 'Vérification anti-robot…',
        sending: 'Envoi…',
        done: "C'est noté : vous recevrez un seul message à la sortie de l'app.",
        unsubscribe: 'Lien de désinscription (gardez-le pour partir avant la sortie)',
        invalid_email: "Cette adresse e-mail n'est pas valide.",
        consent_required: 'Cochez la case pour accepter le message de sortie.',
        turnstile: "La vérification anti-robot n'a pas abouti. Réessayez dans un instant.",
        verification_required: "La vérification anti-robot n'a pas abouti. Réessayez dans un instant.",
        verification_failed: "La vérification anti-robot n'a pas abouti. Réessayez dans un instant.",
        verification_unavailable: "L'inscription n'est pas disponible pour le moment. Réessayez plus tard.",
        rate_limited: 'Trop de tentatives depuis votre connexion. Réessayez dans une heure.',
        network: 'Le serveur est injoignable. Vérifiez votre connexion et réessayez.',
        server: 'Une erreur est survenue sur le serveur. Réessayez plus tard.',
      },
    },
    footer: { code: "Tout le travail sur l'app est public :", source: 'le voir sur GitHub', credits: 'Sources et crédits', site: 'Textes et images du site sous licence CC BY-SA 4.0.', ask: 'Une question ou une erreur ?', askLink: 'Posez-la sur GitHub' },
  },
};

export const ISSUES = 'https://github.com/tracesblanches/tracesblanches/issues';
/** The pinned release issue of the public repository: subscribing to it is the other way to be notified. */
export const RELEASE_ISSUE = 'https://github.com/tracesblanches/tracesblanches/issues/1';
/** The release form, at the bottom of every page but the 404 (src/components/Notify.astro). */
export const NOTIFY_ANCHOR = '#notify';
