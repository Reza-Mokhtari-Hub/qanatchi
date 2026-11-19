import { handleEdgeRequest } from './router';

interface EdgeFetchEvent extends Event {
  readonly request: Request;
  respondWith(response: Response | Promise<Response>): void;
}

/**
 * ArvanCloud Edge Computing production entry point.
 *
 * Uses the standard fetch-event listener model:
 *   addEventListener("fetch", event => { event.respondWith(handleRequest(event.request)); });
 *
 * Zero Node.js APIs, zero Express, zero `process.env`, zero Cloudflare bindings,
 * and zero test-only in-memory storage adapters are included in this production bundle.
 */
addEventListener('fetch', (event: Event) => {
  const fetchEvent = event as EdgeFetchEvent;
  fetchEvent.respondWith(handleEdgeRequest(fetchEvent.request));
});
