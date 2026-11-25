import type { TileRotationAction, VerifiableChallengeType } from '../engagement/solutionReplay';
import type { StorageLike } from './progressStorage';

export const PLAYER_PROFILE_STORAGE_KEY = 'qanatchi_v1_player_profile';
export const UNSENT_SUBMISSIONS_STORAGE_KEY = 'qanatchi_v1_unsent_submissions';
export const MAX_UNSENT_SUBMISSIONS = 20;

export interface LocalPlayerProfile {
  displayLabel: string;
}

export interface QueuedLeaderboardSubmission {
  idempotencyKey: string;
  challengeType: VerifiableChallengeType;
  challengeId: string;
  dateKey?: string;
  levelId?: number;
  algoVersion: number;
  actions: TileRotationAction[];
  playerId: string;
  displayLabel: string;
  attemptToken?: string;
  queuedAt: string;
}

function getBrowserStorage(): StorageLike | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

export function sanitizeClientDisplayLabel(raw: string): string {
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
  return cleaned.length >= 2 ? cleaned : 'مسافر قنات';
}

export function getPlayerDisplayLabel(storage: StorageLike | null = getBrowserStorage()): string {
  if (!storage) return 'مسافر قنات';
  try {
    const raw = storage.getItem(PLAYER_PROFILE_STORAGE_KEY);
    if (!raw) return 'مسافر قنات';
    const parsed = JSON.parse(raw) as Partial<LocalPlayerProfile>;
    if (typeof parsed.displayLabel === 'string') {
      return sanitizeClientDisplayLabel(parsed.displayLabel);
    }
  } catch {
    // Ignore storage errors
  }
  return 'مسافر قنات';
}

export function setPlayerDisplayLabel(
  label: string,
  storage: StorageLike | null = getBrowserStorage(),
): string {
  const sanitized = sanitizeClientDisplayLabel(label);
  if (storage) {
    try {
      storage.setItem(
        PLAYER_PROFILE_STORAGE_KEY,
        JSON.stringify({ displayLabel: sanitized }),
      );
    } catch {
      // Ignore quota/storage errors
    }
  }
  return sanitized;
}

export function listUnsentSubmissions(
  storage: StorageLike | null = getBrowserStorage(),
): QueuedLeaderboardSubmission[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(UNSENT_SUBMISSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is QueuedLeaderboardSubmission =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as QueuedLeaderboardSubmission).idempotencyKey === 'string' &&
        typeof (item as QueuedLeaderboardSubmission).challengeId === 'string' &&
        Array.isArray((item as QueuedLeaderboardSubmission).actions),
    );
  } catch {
    return [];
  }
}

function saveUnsentSubmissions(
  items: QueuedLeaderboardSubmission[],
  storage: StorageLike | null,
): void {
  if (!storage) return;
  try {
    const bounded = items.slice(-MAX_UNSENT_SUBMISSIONS);
    storage.setItem(UNSENT_SUBMISSIONS_STORAGE_KEY, JSON.stringify(bounded));
  } catch {
    // Ignore storage quota errors
  }
}

export function enqueueUnsentSubmission(
  submission: QueuedLeaderboardSubmission,
  storage: StorageLike | null = getBrowserStorage(),
): QueuedLeaderboardSubmission[] {
  const existing = listUnsentSubmissions(storage);
  if (existing.some((item) => item.idempotencyKey === submission.idempotencyKey)) {
    return existing;
  }
  const next = [...existing, submission].slice(-MAX_UNSENT_SUBMISSIONS);
  saveUnsentSubmissions(next, storage);
  return next;
}

export function removeUnsentSubmission(
  idempotencyKey: string,
  storage: StorageLike | null = getBrowserStorage(),
): QueuedLeaderboardSubmission[] {
  const existing = listUnsentSubmissions(storage);
  const next = existing.filter((item) => item.idempotencyKey !== idempotencyKey);
  saveUnsentSubmissions(next, storage);
  return next;
}
