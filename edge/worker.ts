import { handleEdgeRequest } from './router';

interface EdgeFetchEvent extends Event {
  readonly request: Request;
  readonly env?: Record<string, unknown>;
  readonly bindings?: Record<string, unknown>;
  respondWith(response: Response | Promise<Response>): void;
}

/**
 * ArvanCloud Edge Computing production entry point.
 *
 * Uses the standard fetch-event listener model:
 *   addEventListener("fetch", event => { event.respondWith(handleRequest(event.request)); });
 *
 * Supports variables injected on `globalThis`, lexical global bindings, and `event.env`/`event.bindings`.
 * Zero Node.js APIs, zero Express, zero `process.env`, zero Cloudflare imports,
 * and zero test-only in-memory storage adapters are included in this production bundle.
 */
addEventListener('fetch', (event: Event) => {
  const fetchEvent = event as EdgeFetchEvent;
  const bindings =
    fetchEvent.env && typeof fetchEvent.env === 'object'
      ? fetchEvent.env
      : fetchEvent.bindings && typeof fetchEvent.bindings === 'object'
        ? fetchEvent.bindings
        : undefined;
  fetchEvent.respondWith(
    handleEdgeRequest(fetchEvent.request, bindings ? { bindings } : undefined),
  );
});
