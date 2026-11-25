import { isRotatableTile, rotateClockwise } from '../engine/connections';
import { simulateWaterFlow } from '../engine/simulator';
import type { LevelDefinition, TileState } from '../engine/types';
import { LEVELS } from '../levels/levels';
import {
  DAILY_PUZZLE_ALGO_VERSION,
  generateDailyChallenge,
  SUPPORTED_DAILY_ALGO_VERSIONS,
} from './dailyChallenge';
import {
  FRIEND_CHALLENGE_ALGO_VERSION,
  parseFriendChallengeCode,
  SUPPORTED_FRIEND_ALGO_VERSIONS,
} from './friendChallenge';
import {
  calculateRankedScore,
  RANKED_SCORING_ALGO_VERSION,
  type RankedScoreResult,
} from './rankedScoring';
import { diffTehranDateKeys, getTehranDateKey, isValidDateKey } from './tehranTime';

export const MAX_SUBMITTED_ACTIONS = 200;
export const MAX_VERIFY_BODY_BYTES = 16 * 1024; // 16 KiB
export const CAMPAIGN_PUZZLE_ALGO_VERSION = 1;
export const SUPPORTED_CAMPAIGN_ALGO_VERSIONS: readonly number[] = [1];

export type VerifiableChallengeType = 'campaign' | 'daily' | 'friend';

export interface TileRotationAction {
  row: number;
  col: number;
}

export interface ChallengeVerifyRequestPayload {
  challengeType: VerifiableChallengeType;
  challengeId: string;
  dateKey?: string;
  levelId?: number;
  algoVersion: number;
  actions: TileRotationAction[];
  attemptToken?: string;
  idempotencyKey?: string;
}

export type ChallengeVerifyErrorCode =
  | 'INVALID_CHALLENGE_TYPE'
  | 'INVALID_CHALLENGE_ID'
  | 'INVALID_DATE_KEY'
  | 'FUTURE_DATE_NOT_ALLOWED'
  | 'UNSUPPORTED_ALGO_VERSION'
  | 'CHALLENGE_ID_MISMATCH'
  | 'INVALID_FRIEND_CHALLENGE'
  | 'INVALID_LEVEL_ID'
  | 'INVALID_ACTIONS_FORMAT'
  | 'ACTION_LIMIT_EXCEEDED'
  | 'INVALID_ACTION_COORDINATES'
  | 'INVALID_ACTION_TILE'
  | 'SOLUTION_HAS_LEAKS'
  | 'SOLUTION_INCOMPLETE';

export type ChallengeVerificationOutcome =
  | {
      ok: true;
      challengeType: VerifiableChallengeType;
      challengeId: string;
      dateKey: string | null;
      algoVersion: number;
      scoringVersion: number;
      templateId: string;
      difficulty: LevelDefinition['difficulty'];
      rows: number;
      cols: number;
      verifiedMoves: number;
      trustedExpectedMinMoves: number;
      rankedScore: RankedScoreResult;
    }
  | {
      ok: false;
      httpStatus: number;
      code: ChallengeVerifyErrorCode;
      message: string;
      details?: Record<string, unknown>;
    };

function buildInitialBoardFromDefinition(level: LevelDefinition): TileState[][] {
  return level.grid.map((rowTiles, r) =>
    rowTiles.map((tile, c) => ({
      row: r,
      col: c,
      type: tile.type,
      rotation: tile.initialRotation,
      visualRotation: tile.initialRotation,
      locked: Boolean(tile.locked),
    })),
  );
}

export interface ResolvedChallengeDefinition {
  ok: true;
  challengeType: VerifiableChallengeType;
  challengeId: string;
  dateKey: string | null;
  algoVersion: number;
  templateId: string;
  level: LevelDefinition;
}

export function resolveTrustedChallengeDefinition(
  rawPayload: Record<string, unknown>,
  options?: { now?: Date },
):
  | ResolvedChallengeDefinition
  | {
      ok: false;
      httpStatus: number;
      code: ChallengeVerifyErrorCode;
      message: string;
      details?: Record<string, unknown>;
    } {
  const challengeType = rawPayload.challengeType;
  if (challengeType !== 'campaign' && challengeType !== 'daily' && challengeType !== 'friend') {
    return {
      ok: false,
      httpStatus: 400,
      code: 'INVALID_CHALLENGE_TYPE',
      message: 'challengeType must be "campaign", "daily", or "friend".',
    };
  }

  const rawChallengeId =
    typeof rawPayload.challengeId === 'string' ? rawPayload.challengeId.trim() : '';
  if (!rawChallengeId || rawChallengeId.length > 64) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'INVALID_CHALLENGE_ID',
      message: 'challengeId must be a non-empty string up to 64 characters.',
    };
  }

  const rawAlgoVersion = rawPayload.algoVersion;
  if (typeof rawAlgoVersion !== 'number' || !Number.isInteger(rawAlgoVersion)) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'UNSUPPORTED_ALGO_VERSION',
      message: 'algoVersion must be a supported integer.',
    };
  }

  if (challengeType === 'campaign') {
    if (!SUPPORTED_CAMPAIGN_ALGO_VERSIONS.includes(rawAlgoVersion)) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'UNSUPPORTED_ALGO_VERSION',
        message: `Unsupported campaign puzzle algorithm version: ${rawAlgoVersion}.`,
        details: { supportedVersions: [...SUPPORTED_CAMPAIGN_ALGO_VERSIONS] },
      };
    }

    const match = /^campaign-(\d+)$/i.exec(rawChallengeId);
    const levelIdFromBody =
      typeof rawPayload.levelId === 'number' && Number.isInteger(rawPayload.levelId)
        ? rawPayload.levelId
        : match
          ? Number.parseInt(match[1], 10)
          : NaN;

    if (
      !Number.isInteger(levelIdFromBody) ||
      levelIdFromBody < 1 ||
      levelIdFromBody > LEVELS.length
    ) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'INVALID_LEVEL_ID',
        message: `Campaign levelId must be an integer between 1 and ${LEVELS.length}.`,
      };
    }

    const expectedChallengeId = `campaign-${levelIdFromBody}`;
    if (rawChallengeId.toLowerCase() !== expectedChallengeId) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'CHALLENGE_ID_MISMATCH',
        message: `challengeId must match "${expectedChallengeId}" for levelId=${levelIdFromBody}.`,
      };
    }

    const foundLevel = LEVELS.find((lvl) => lvl.id === levelIdFromBody);
    if (!foundLevel) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'INVALID_LEVEL_ID',
        message: `Unknown campaign levelId: ${levelIdFromBody}.`,
      };
    }

    return {
      ok: true,
      challengeType: 'campaign',
      challengeId: expectedChallengeId,
      dateKey: null,
      algoVersion: CAMPAIGN_PUZZLE_ALGO_VERSION,
      templateId: `campaign_lvl_${foundLevel.id}`,
      level: foundLevel,
    };
  }

  if (challengeType === 'daily') {
    if (!SUPPORTED_DAILY_ALGO_VERSIONS.includes(rawAlgoVersion)) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'UNSUPPORTED_ALGO_VERSION',
        message: `Unsupported daily puzzle algorithm version: ${rawAlgoVersion}.`,
        details: { supportedVersions: [...SUPPORTED_DAILY_ALGO_VERSIONS] },
      };
    }

    const rawDateKey = typeof rawPayload.dateKey === 'string' ? rawPayload.dateKey.trim() : '';
    if (!isValidDateKey(rawDateKey)) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'INVALID_DATE_KEY',
        message: 'Daily challenge verification requires a valid YYYY-MM-DD dateKey.',
      };
    }

    const serverTodayKey = getTehranDateKey(options?.now ?? new Date());
    const deltaDays = diffTehranDateKeys(rawDateKey, serverTodayKey);
    if (deltaDays === null || deltaDays < 0) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'FUTURE_DATE_NOT_ALLOWED',
        message: 'Submissions for future Tehran calendar dates are not allowed.',
        details: { serverTodayKey, submittedDateKey: rawDateKey },
      };
    }

    const daily = generateDailyChallenge(rawDateKey, rawAlgoVersion);
    if (rawChallengeId !== daily.challengeId) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'CHALLENGE_ID_MISMATCH',
        message: 'challengeId does not match the authoritative daily challenge for the given dateKey and algoVersion.',
      };
    }

    return {
      ok: true,
      challengeType: 'daily',
      challengeId: daily.challengeId,
      dateKey: daily.dateKey,
      algoVersion: DAILY_PUZZLE_ALGO_VERSION,
      templateId: daily.templateId,
      level: daily.level,
    };
  }

  if (!SUPPORTED_FRIEND_ALGO_VERSIONS.includes(rawAlgoVersion)) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'UNSUPPORTED_ALGO_VERSION',
      message: `Unsupported friend challenge algorithm version: ${rawAlgoVersion}.`,
      details: { supportedVersions: [...SUPPORTED_FRIEND_ALGO_VERSIONS] },
    };
  }

  const parsed = parseFriendChallengeCode(rawChallengeId);
  if (!parsed.ok) {
    const code: ChallengeVerifyErrorCode =
      parsed.reason === 'unsupported_version'
        ? 'UNSUPPORTED_ALGO_VERSION'
        : 'INVALID_FRIEND_CHALLENGE';
    return {
      ok: false,
      httpStatus: 400,
      code,
      message: `Invalid friend challenge code (${parsed.reason}).`,
    };
  }

  if (parsed.challenge.algoVersion !== rawAlgoVersion) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'CHALLENGE_ID_MISMATCH',
      message: 'algoVersion does not match the friend challenge identifier.',
    };
  }

  return {
    ok: true,
    challengeType: 'friend',
    challengeId: parsed.challenge.challengeId,
    dateKey: null,
    algoVersion: FRIEND_CHALLENGE_ALGO_VERSION,
    templateId: parsed.challenge.templateId,
    level: parsed.challenge.level,
  };
}

/**
 * Independently reconstruct the trusted puzzle definition and replay a submitted
 * clockwise tile-rotation sequence against the authoritative Qanatchi simulation engine.
 *
 * Security guarantees:
 * - Never reads or trusts client-supplied score, stars, move count, board grid, or min moves.
 * - Rejects malformed inputs, unsupported algorithm versions, out-of-bounds actions,
 *   rotations on locked/non-rotatable tiles, excessive action counts, leaks, and unreached destinations.
 */
export function replayAndVerifyChallengeSubmission(
  rawPayload: unknown,
  options?: { now?: Date },
): ChallengeVerificationOutcome {
  if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'INVALID_ACTIONS_FORMAT',
      message: 'Submission payload must be a JSON object.',
    };
  }

  const body = rawPayload as Record<string, unknown>;
  const resolved = resolveTrustedChallengeDefinition(body, options);
  if (!resolved.ok) {
    return resolved;
  }

  const rawActions = body.actions;
  if (!Array.isArray(rawActions)) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'INVALID_ACTIONS_FORMAT',
      message: 'actions must be an array of { row, col } rotation steps.',
    };
  }

  if (rawActions.length === 0) {
    return {
      ok: false,
      httpStatus: 422,
      code: 'SOLUTION_INCOMPLETE',
      message: 'Action sequence cannot be empty.',
    };
  }

  if (rawActions.length > MAX_SUBMITTED_ACTIONS) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'ACTION_LIMIT_EXCEEDED',
      message: `Action sequence exceeds maximum allowed length of ${MAX_SUBMITTED_ACTIONS}.`,
      details: { maxActions: MAX_SUBMITTED_ACTIONS, received: rawActions.length },
    };
  }

  const { level, challengeType, challengeId: canonicalChallengeId, dateKey: resolvedDateKey, algoVersion, templateId } =
    resolved;

  // Reconstruct initial board independently and replay every submitted action
  const board = buildInitialBoardFromDefinition(level);

  for (let i = 0; i < rawActions.length; i++) {
    const step = rawActions[i];
    if (!step || typeof step !== 'object' || Array.isArray(step)) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'INVALID_ACTION_COORDINATES',
        message: `Action at index ${i} must be an object with integer row and col.`,
      };
    }

    const row = (step as Record<string, unknown>).row;
    const col = (step as Record<string, unknown>).col;
    if (
      typeof row !== 'number' ||
      typeof col !== 'number' ||
      !Number.isInteger(row) ||
      !Number.isInteger(col) ||
      row < 0 ||
      row >= level.rows ||
      col < 0 ||
      col >= level.cols
    ) {
      return {
        ok: false,
        httpStatus: 400,
        code: 'INVALID_ACTION_COORDINATES',
        message: `Action at index ${i} has out-of-bounds coordinates for ${level.rows}x${level.cols} board.`,
      };
    }

    const tile = board[row][col];
    if (!isRotatableTile(tile.type, tile.locked)) {
      return {
        ok: false,
        httpStatus: 422,
        code: 'INVALID_ACTION_TILE',
        message: `Action at index ${i} attempted to rotate a fixed or non-rotatable tile (${tile.type}) at (${row},${col}).`,
      };
    }

    tile.rotation = rotateClockwise(tile.rotation);
    tile.visualRotation += 90;
  }

  const simulation = simulateWaterFlow(board);
  if (!simulation.isValidSolution) {
    if (simulation.leaks.length > 0) {
      return {
        ok: false,
        httpStatus: 422,
        code: 'SOLUTION_HAS_LEAKS',
        message: 'Replayed solution has water leaks and is not valid.',
        details: {
          leakCount: simulation.leaks.length,
          allDestinationsReached: simulation.allDestinationsReached,
        },
      };
    }
    return {
      ok: false,
      httpStatus: 422,
      code: 'SOLUTION_INCOMPLETE',
      message: 'Replayed solution does not reach all required destinations.',
      details: {
        unreachedDestinations: simulation.unreachedDestinations.length,
      },
    };
  }

  const verifiedMoves = rawActions.length;
  const rankedScore = calculateRankedScore({
    verifiedSolved: true,
    verifiedMoves,
    trustedExpectedMinMoves: level.expectedMinMoves,
    difficulty: level.difficulty,
  });

  return {
    ok: true,
    challengeType,
    challengeId: canonicalChallengeId,
    dateKey: resolvedDateKey,
    algoVersion,
    scoringVersion: RANKED_SCORING_ALGO_VERSION,
    templateId,
    difficulty: level.difficulty,
    rows: level.rows,
    cols: level.cols,
    verifiedMoves,
    trustedExpectedMinMoves: level.expectedMinMoves,
    rankedScore,
  };
}
