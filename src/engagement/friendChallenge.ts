import type { Difficulty, FriendChallengeDefinition } from '../engine/types';
import { hashStringFNV1a } from './prng';
import {
  getTemplateById,
  getTemplateByNumericIndex,
  PUZZLE_TEMPLATES,
} from './puzzleTemplates';
import { buildDeterministicLevelFromTemplate } from './puzzleTransform';

export const FRIEND_CHALLENGE_ALGO_VERSION = 1;
export const SUPPORTED_FRIEND_ALGO_VERSIONS: readonly number[] = [1];
export const CHALLENGE_URL_PARAM = 'challenge';

const CHALLENGE_CODE_REGEX = /^Q(\d+)-(\d{2})-([0-9A-F]{1,8})-([0-9A-F]{2})$/i;

export type FriendChallengeParseErrorReason =
  | 'empty'
  | 'malformed'
  | 'unsupported_version'
  | 'invalid_template'
  | 'invalid_checksum'
  | 'verification_failed';

export type FriendChallengeParseResult =
  | {
      ok: true;
      challenge: FriendChallengeDefinition;
    }
  | {
      ok: false;
      reason: FriendChallengeParseErrorReason;
      rawCode: string;
      messageFa: string;
    };

function computeChecksumHex(algoVersion: number, templateNum: number, seed: number): string {
  const payload = `qanatchi:friend-check:v${algoVersion}:t${templateNum}:s${seed >>> 0}`;
  const checkByte = hashStringFNV1a(payload) & 0xff;
  return checkByte.toString(16).toUpperCase().padStart(2, '0');
}

/**
 * Format a deterministic, checksum-protected Friend Challenge identifier.
 * Format: Q<version>-<template2Digits>-<seedHex>-<checksum2Hex>
 * Example: Q1-04-9A3F1C2B-E4
 */
export function encodeFriendChallengeId(
  templateNumericIndex: number,
  seed: number,
  algoVersion: number = FRIEND_CHALLENGE_ALGO_VERSION,
): string {
  const tplPart = String(templateNumericIndex).padStart(2, '0');
  const safeSeed = seed >>> 0;
  const seedHex = safeSeed.toString(16).toUpperCase().padStart(8, '0');
  const checkHex = computeChecksumHex(algoVersion, templateNumericIndex, safeSeed);
  return `Q${algoVersion}-${tplPart}-${seedHex}-${checkHex}`;
}

/**
 * Create a deterministic Friend Challenge from a verified template ID and 32-bit seed.
 */
export function createFriendChallengeFromTemplate(
  templateId: string,
  seed: number,
  algoVersion: number = FRIEND_CHALLENGE_ALGO_VERSION,
): FriendChallengeDefinition {
  const template = getTemplateById(templateId) ?? PUZZLE_TEMPLATES[0];
  const safeSeed = seed >>> 0;
  const challengeId = encodeFriendChallengeId(template.numericIndex, safeSeed, algoVersion);

  const level = buildDeterministicLevelFromTemplate(template, safeSeed, {
    syntheticLevelId: 2000 + template.numericIndex,
    titleFa: template.titleFa,
    subtitleFa: template.introFa,
  });

  return {
    challengeId,
    algoVersion,
    templateId: template.id,
    seed: safeSeed,
    titleFa: template.titleFa,
    introFa: template.introFa,
    difficulty: template.difficulty,
    level,
  };
}

/**
 * Deterministically create a Friend Challenge by selecting a difficulty bucket and entropy seed.
 */
export function createFriendChallengeByDifficulty(
  difficulty: Difficulty | 'any',
  entropyInput: string,
): FriendChallengeDefinition {
  const candidates =
    difficulty === 'any'
      ? PUZZLE_TEMPLATES
      : PUZZLE_TEMPLATES.filter((t) => t.difficulty === difficulty);
  const pool = candidates.length > 0 ? candidates : PUZZLE_TEMPLATES;
  const seed = hashStringFNV1a(`qanatchi:friend-gen:${difficulty}:${entropyInput}`);
  const template = pool[seed % pool.length];
  return createFriendChallengeFromTemplate(template.id, seed);
}

/**
 * Safely parse and verify a Friend Challenge code (from URL or manual input).
 * Never trusts arbitrary payload fields; validates syntax, version, template, checksum, and engine verification.
 */
export function parseFriendChallengeCode(rawInput: string): FriendChallengeParseResult {
  const trimmed = rawInput.trim().toUpperCase();
  if (!trimmed) {
    return {
      ok: false,
      reason: 'empty',
      rawCode: rawInput,
      messageFa: 'کد رقابت وارد نشده است.',
    };
  }

  const match = CHALLENGE_CODE_REGEX.exec(trimmed);
  if (!match) {
    return {
      ok: false,
      reason: 'malformed',
      rawCode: rawInput,
      messageFa: 'لینک یا کد رقابت نامعتبر است و قالب استانداردی ندارد.',
    };
  }

  const algoVersion = Number.parseInt(match[1], 10);
  const templateNum = Number.parseInt(match[2], 10);
  const seedHex = match[3];
  const providedCheck = match[4].toUpperCase();

  if (!SUPPORTED_FRIEND_ALGO_VERSIONS.includes(algoVersion)) {
    return {
      ok: false,
      reason: 'unsupported_version',
      rawCode: rawInput,
      messageFa: 'نسخه این لینک رقابت در نسخه فعلی بازی پشتیبانی نمی‌شود.',
    };
  }

  const template = getTemplateByNumericIndex(templateNum);
  if (!template) {
    return {
      ok: false,
      reason: 'invalid_template',
      rawCode: rawInput,
      messageFa: 'الگوی معمای موجود در لینک رقابت معتبر نیست.',
    };
  }

  const seed = Number.parseInt(seedHex, 16) >>> 0;
  const expectedCheck = computeChecksumHex(algoVersion, templateNum, seed);
  if (providedCheck !== expectedCheck) {
    return {
      ok: false,
      reason: 'invalid_checksum',
      rawCode: rawInput,
      messageFa: 'لینک رقابت ناقص است یا دستکاری شده و قابل بارگذاری نیست.',
    };
  }

  try {
    const challenge = createFriendChallengeFromTemplate(template.id, seed, algoVersion);
    return {
      ok: true,
      challenge,
    };
  } catch {
    return {
      ok: false,
      reason: 'verification_failed',
      rawCode: rawInput,
      messageFa: 'ساخت معمای این رقابت با خطا مواجه شد.',
    };
  }
}

/**
 * Extract and parse a Friend Challenge from a URL query string (e.g. "?challenge=Q1-...").
 * Returns null when no `challenge` query parameter is present.
 */
export function parseFriendChallengeFromSearch(search: string): FriendChallengeParseResult | null {
  try {
    const params = new URLSearchParams(search);
    if (!params.has(CHALLENGE_URL_PARAM)) {
      return null;
    }
    const rawValue = params.get(CHALLENGE_URL_PARAM) ?? '';
    return parseFriendChallengeCode(rawValue);
  } catch {
    return {
      ok: false,
      reason: 'malformed',
      rawCode: search,
      messageFa: 'پارامترهای آدرس رقابت نامعتبر هستند.',
    };
  }
}

/**
 * Build a clean shareable URL containing only the reproducible challenge identifier.
 */
export function buildFriendChallengeUrl(
  challengeId: string,
  baseUrl?: string,
): string {
  const fallbackBase =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://qanatchi.local/';
  const targetBase = baseUrl || fallbackBase;
  try {
    const url = new URL(targetBase);
    url.search = '';
    url.hash = '';
    url.searchParams.set(CHALLENGE_URL_PARAM, challengeId);
    return url.toString();
  } catch {
    const cleanBase = targetBase.split('?')[0].split('#')[0];
    return `${cleanBase}?${CHALLENGE_URL_PARAM}=${encodeURIComponent(challengeId)}`;
  }
}

export function buildFriendShareTextFa(challenge: FriendChallengeDefinition): string {
  return `دعوت به رقابت در قنات‌چی! معمای «${challenge.titleFa}» (کد ${challenge.challengeId}) را با همین چیدمان حل کن و رکوردت را بسنج:`;
}
