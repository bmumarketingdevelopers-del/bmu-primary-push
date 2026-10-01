/**
 * Where a public form was filled in, sent alongside its fields.
 *
 * document.referrer is set on the first page load and survives client-side
 * navigation, so it names the site that brought the visitor in (Google,
 * Instagram…) rather than the previous page on ours.
 */
export function formContext() {
  return {
    page: window.location.pathname,
    referrer: document.referrer || undefined,
  };
}
