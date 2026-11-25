/**
 * Structured JSON observability logger for QANATCHI ArvanCloud Edge API.
 *
 * Emits single-line JSON logs viewable in ArvanCloud Edge Computing Console Log,
 * while strictly redacting any sensitive credential, authorization header, or token fields.
 */

export type EdgeLogLevel = 'info' | 'warn' | 'error';

export interface EdgeLogEvent {
  ts: string;
  level: EdgeLogLevel;
  requestId: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  storageDriver: string;
  errorCode?: string;
  details?: Record<string, unknown>;
}

const SENSITIVE_KEY_REGEX =
  /password|secret|token|authorization|cookie|api_key|apikey|database_url|connection_string/i;

function sanitizeLogValue(value: unknown, depth = 0): unknown {
  if (depth > 3) return '[truncated]';
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') {
    if (value.length > 160) return `${value.slice(0, 157)}...`;
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    return value.slice(0, 10).map((item) => sanitizeLogValue(item, depth + 1));
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY_REGEX.test(k)) {
        out[k] = '[REDACTED]';
      } else {
        out[k] = sanitizeLogValue(v, depth + 1);
      }
    }
    return out;
  }
  return String(value);
}

export function emitEdgeStructuredLog(
  event: EdgeLogEvent,
  enabled = true,
): void {
  if (!enabled) return;
  try {
    const safeDetails = event.details ? (sanitizeLogValue(event.details) as Record<string, unknown>) : undefined;
    const payload: EdgeLogEvent = {
      ...event,
      ...(safeDetails ? { details: safeDetails } : {}),
    };
    const line = JSON.stringify(payload);
    if (event.level === 'error') {
      console.error(line);
    } else if (event.level === 'warn') {
      console.warn(line);
    } else {
      console.log(line);
    }
  } catch {
    // Never allow logging failures to crash request execution
  }
}
