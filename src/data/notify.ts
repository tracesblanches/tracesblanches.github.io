// The "Get notified of the release" form (src/components/Notify.astro): it posts to the project's
// server, which keeps the address, the language and the date until the one release message is
// sent (privacy page, "Notified of the release"). An invisible Cloudflare Turnstile check runs
// when the form is sent, its script loaded only once the form is used.
//
// Read at build time, with defaults for the published site:
// - NOTIFY_ENDPOINT: where the form posts (a local server for a test of the whole chain:
//   NOTIFY_ENDPOINT=http://127.0.0.1:8080/v1/notify, with the server's TURNSTILE_SECRET set to
//   Cloudflare's test secret).
// - TURNSTILE_SITE_KEY: the public site key of the invisible widget "tracesblanches-notify"
//   (domains tracesblanches.github.io and skimap.warnier.net). The widget does not run on
//   127.0.0.1: for the local preview, build with Cloudflare's invisible test key
//   TURNSTILE_SITE_KEY=1x00000000000000000000BB (always passes).
export const NOTIFY = {
  endpoint: process.env.NOTIFY_ENDPOINT || 'https://skimap.warnier.net/v1/notify',
  turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '0x4AAAAAAGM4TCjlDboEloUm',
  turnstileScript: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
};
