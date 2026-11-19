import { isRotatableTile, rotateClockwise } from '../engine/connections';
import { simulateWaterFlow } from '../engine/simulator';
import type { LevelDefinition, TileState } from '../engine/types';
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

export type VerifiableChallengeType = 'daily' | 'friend';

export interface TileRotationAction {
  row: number;
  col: number;
}

export interface ChallengeVerifyRequestPayload {
  challengeType: VerifiableChallengeType;
  challengeId: string;
  dateKey?: string;
  algoVersion: number;
  actions: TileRotationAction[];
}

export type ChallengeVerifyErrorCode =
  | 'INVALID_CHALLENGE_TYPE'
  | 'INVALID_CHALLENGE_ID'
  | 'INVALID_DATE_KEY'
  | 'FUTURE_DATE_NOT_ALLOWED'
  | 'UNSUPPORTED_ALGO_VERSION'
  | 'CHALLENGE_ID_MISMATCH'
  | 'INVALID_FRIEND_CHALLENGE'
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
  const challengeType = body.challengeType;
  if (challengeType !== 'daily' && challengeType !== 'friend') {
    return {
      ok: false,
      httpStatus: 400,
      code: 'INVALID_CHALLENGE_TYPE',
      message: 'challengeType must be "daily" or "friend".',
    };
  }

  const rawChallengeId = typeof body.challengeId === 'string' ? body.challengeId.trim() : '';
  if (!rawChallengeId || rawChallengeId.length > 64) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'INVALID_CHALLENGE_ID',
      message: 'challengeId must be a non-empty string up to 64 characters.',
    };
  }

  const rawAlgoVersion = body.algoVersion;
  if (typeof rawAlgoVersion !== 'number' || !Number.isInteger(rawAlgoVersion)) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'UNSUPPORTED_ALGO_VERSION',
      message: 'algoVersion must be a supported integer.',
    };
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

  let level: LevelDefinition;
  let canonicalChallengeId: string;
  let resolvedDateKey: string | null = null;
  let templateId: string;

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

    const rawDateKey = typeof body.dateKey === 'string' ? body.dateKey.trim() : '';
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

    level = daily.level;
    canonicalChallengeId = daily.challengeId;
    resolvedDateKey = daily.dateKey;
    templateId = daily.templateId;
  } else {
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

    level = parsed.challenge.level;
    canonicalChallengeId = parsed.challenge.challengeId;
    resolvedDateKey = null;
    templateId = parsed.challenge.templateId;
  }

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
    algoVersion:
      challengeType === 'daily' ? DAILY_PUZZLE_ALGO_VERSION : FRIEND_CHALLENGE_ALGO_VERSION,
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
