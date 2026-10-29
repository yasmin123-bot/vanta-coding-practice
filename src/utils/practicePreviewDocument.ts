const contentSecurityPolicy = "default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; font-src data:; media-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'";

const bridgeFor = (token: string) => `
(() => {
  const token = ${JSON.stringify(token)};
  let errorReported = false;
  const userScriptName = 'vanta-user-code-' + token + '.js';
  const send = (payload) => parent.postMessage({ ...payload, token }, '*');
  const stackLocation = (stack) => {
    if (typeof stack !== 'string') return { line: null, column: null };
    const match = stack.match(new RegExp(userScriptName + ':(\\\\d+):(\\\\d+)'));
    return match ? { line: Number(match[1]), column: Number(match[2]) } : { line: null, column: null };
  };
  const report = (error, location = {}) => {
    if (errorReported) return;
    errorReported = true;
    const value = error instanceof Error ? error : null;
    const message = value?.message || (typeof error === 'string' ? error : String(error || 'An error occurred while running JavaScript.'));
    const parsed = stackLocation(value?.stack || (typeof error === 'object' && error ? error.stack : ''));
    send({
      type: 'vanta-preview-error',
      message: String(message).slice(0, 300),
      detail: String(value?.stack || message).slice(0, 500),
      line: Number.isInteger(location.line) && location.line > 0 ? location.line : parsed.line,
      column: Number.isInteger(location.column) && location.column > 0 ? location.column : parsed.column
    });
  };

  window.addEventListener('error', (event) => {
    if (event.filename && !event.filename.includes('vanta-user-code-')) return;
    report(event.error || event.message || 'A JavaScript runtime error occurred.', {
      line: event.lineno,
      column: event.colno
    });
  });
  window.addEventListener('unhandledrejection', (event) => {
    report(event.reason || 'An asynchronous JavaScript error occurred.');
  });

  window.addEventListener('message', (event) => {
    if (event.source !== parent || !event.data || event.data.type !== 'vanta-run-code' || event.data.token !== token) return;
    errorReported = false;
    try {
      const style = document.createElement('style');
      style.textContent = typeof event.data.css === 'string' ? event.data.css : '';
      document.head.appendChild(style);

      const script = document.createElement('script');
      const javascript = typeof event.data.javascript === 'string' ? event.data.javascript : '';
      script.textContent = javascript + '\\n//# sourceURL=' + userScriptName;
      document.body.appendChild(script);
      window.setTimeout(() => send({ type: 'vanta-preview-complete' }), 120);
    } catch (error) {
      report(error);
    }
  });
})();`;

export function buildPracticePreviewDocument(html: string, token: string): string {
  const csp = `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}">`;
  const bridge = `<script>${bridgeFor(token)}</script>`;
  const headAdditions = `${csp}${bridge}`;
  const headMatch = /<head\b[^>]*>/i;
  if (headMatch.test(html)) return html.replace(headMatch, (head) => `${head}${headAdditions}`);

  const htmlMatch = /<html\b[^>]*>/i;
  if (htmlMatch.test(html)) return html.replace(htmlMatch, (root) => `${root}<head>${headAdditions}</head>`);

  return `<!doctype html><html><head>${headAdditions}</head><body>${html}</body></html>`;
}
