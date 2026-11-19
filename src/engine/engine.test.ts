import test from 'node:test';
import assert from 'node:assert/strict';
import {
  areRotationsEquivalent,
  getTilePorts,
  minClockwiseRotations,
  rotateClockwise,
  tileKey,
} from './connections';
import { simulateWaterFlow } from './simulator';
import { calculateLevelScore, formatTimePersian, toPersianDigits } from './scoring';
import { getNextHint } from './hints';
import { buildGridFromLevel, verifyLevel } from './verifier';
import { LEVELS } from '../levels/levels';
import {
  clearProgress,
  createDefaultProgress,
  DEFAULT_SETTINGS,
  loadProgress,
  loadSettings,
  PROGRESS_STORAGE_KEY,
  recordLevelCompletion,
  saveSettings,
  type StorageLike,
} from '../storage/progressStorage';
import type { Rotation, TileState, TileType } from './types';

function makeTile(
  row: number,
  col: number,
  type: TileType,
  rotation: Rotation = 0,
): TileState {
  return {
    row,
    col,
    type,
    rotation,
    visualRotation: rotation,
    locked: type === 'source' || type === 'destination' || type === 'blocked' || type === 'empty',
  };
}

function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

test('directional port rotation works clockwise for all pipe types', () => {
  assert.deepEqual(getTilePorts('straight', 0), ['N', 'S']);
  assert.deepEqual(getTilePorts('straight', 90), ['E', 'W']);
  assert.deepEqual(getTilePorts('straight', 180), ['S', 'N']);
  assert.deepEqual(getTilePorts('corner', 0), ['N', 'E']);
  assert.deepEqual(getTilePorts('corner', 90), ['E', 'S']);
  assert.deepEqual(getTilePorts('corner', 180), ['S', 'W']);
  assert.deepEqual(getTilePorts('corner', 270), ['W', 'N']);
  assert.deepEqual(getTilePorts('tee', 0), ['N', 'E', 'W']);
  assert.deepEqual(getTilePorts('tee', 90), ['E', 'S', 'N']);
  assert.deepEqual(getTilePorts('cross', 270), ['W', 'N', 'E', 'S']);
  assert.deepEqual(getTilePorts('blocked', 0), []);
  assert.equal(rotateClockwise(270), 0);
  assert.equal(areRotationsEquivalent('straight', 0, 180), true);
  assert.equal(areRotationsEquivalent('straight', 0, 90), false);
  assert.equal(areRotationsEquivalent('cross', 0, 270), true);
  assert.equal(minClockwiseRotations('straight', 0, 90), 1);
  assert.equal(minClockwiseRotations('corner', 270, 0), 1);
});

test('BFS simulator detects valid straight connection without leaks', () => {
  const grid: TileState[][] = [
    [
      makeTile(0, 0, 'source', 0),
      makeTile(0, 1, 'straight', 90),
      makeTile(0, 2, 'destination', 0),
    ],
  ];
  const sim = simulateWaterFlow(grid);
  assert.equal(sim.isValidSolution, true);
  assert.equal(sim.allDestinationsReached, true);
  assert.equal(sim.leaks.length, 0);
  assert.equal(sim.connectedTiles.length, 3);
  assert.equal(sim.flowMap[tileKey(0, 0)].step, 0);
  assert.equal(sim.flowMap[tileKey(0, 1)].step, 1);
  assert.equal(sim.flowMap[tileKey(0, 2)].step, 2);
});

test('BFS simulator detects mismatch, blocked, empty, and boundary leaks accurately', () => {
  const grid: TileState[][] = [
    [
      makeTile(0, 0, 'source', 0), // E -> (0,1)
      makeTile(0, 1, 'tee', 0), // N (boundary), E (blocked), W (connected to source)
      makeTile(0, 2, 'blocked', 0),
    ],
    [
      makeTile(1, 0, 'straight', 0), // disconnected pipe
      makeTile(1, 1, 'empty', 0),
      makeTile(1, 2, 'destination', 0),
    ],
  ];
  const sim = simulateWaterFlow(grid);
  assert.equal(sim.isValidSolution, false);
  assert.equal(sim.allDestinationsReached, false);
  assert.equal(sim.disconnectedPipeTiles.length, 1);
  assert.equal(sim.leaks.length, 2);
  const reasons = sim.leaks.map((l) => l.reason).sort();
  assert.deepEqual(reasons, ['blocked', 'boundary']);
  assert.equal(sim.invalidPaths.length, 2);
});

test('BFS simulator prevents infinite loops on closed pipe cycles', () => {
  // 2x2 closed loop fed by source, with destination attached off a corner
  const grid: TileState[][] = [
    [
      makeTile(0, 0, 'source', 0),
      makeTile(0, 1, 'tee', 180), // S, W, E
      makeTile(0, 2, 'corner', 180), // S, W
    ],
    [
      makeTile(1, 0, 'destination', 180), // E
      makeTile(1, 1, 'tee', 0), // N, E, W
      makeTile(1, 2, 'corner', 270), // W, N
    ],
  ];
  const sim = simulateWaterFlow(grid);
  assert.equal(sim.isValidSolution, true);
  assert.equal(sim.leaks.length, 0);
  assert.equal(sim.connectedTiles.length, 6);
});

test('all 80 handcrafted campaign levels pass programmatic verification with unique titles and non-duplicate grids', () => {
  assert.equal(LEVELS.length, 80);
  const seenNames = new Set<string>();
  const seenBoardFingerprints = new Set<string>();

  for (const level of LEVELS) {
    assert.ok(!seenNames.has(level.titleFa), `Duplicate Persian level title: ${level.titleFa}`);
    seenNames.add(level.titleFa);
    assert.ok(level.destinationId, `Level ${level.id} is missing destinationId`);

    // Fingerprint canonical grid structure (types + solution rotations) to prevent duplicated boards
    const fingerprint = `${level.rows}x${level.cols}:${level.grid
      .map((row) => row.map((c) => `${c.type[0]}${c.solutionRotation}`).join(','))
      .join('|')}`;
    assert.ok(
      !seenBoardFingerprints.has(fingerprint),
      `Level ${level.id} (${level.titleFa}) duplicates an existing board layout`,
    );
    seenBoardFingerprints.add(fingerprint);

    const report = verifyLevel(level);
    assert.equal(
      report.valid,
      true,
      `Level ${level.id} (${level.titleFa}) failed verification: ${report.errors.join(' | ')}`,
    );
    assert.equal(report.initialAlreadySolved, false);
    assert.equal(report.computedMinMoves, level.expectedMinMoves);
    assert.equal(report.solutionSimulation?.isValidSolution, true);
    assert.equal(report.solutionSimulation?.leaks.length, 0);
    if (level.id >= 41) {
      assert.equal(
        report.solutionSimulation?.disconnectedPipeTiles.length,
        0,
        `Level ${level.id} (${level.titleFa}) has disconnected pipes in solution`,
      );
    }
  }
});

test('hint engine guides player to exact verified leak-free solution across all 80 campaign levels', () => {
  for (const level of LEVELS) {
    const board = buildGridFromLevel(level, 'initial');
    let movesApplied = 0;

    while (movesApplied < 250) {
      const hint = getNextHint(level, board);
      if (!hint) break;
      const tile = board[hint.row][hint.col];
      tile.rotation = rotateClockwise(tile.rotation);
      movesApplied++;
    }

    assert.equal(
      movesApplied,
      level.expectedMinMoves,
      `Level ${level.id} (${level.titleFa}) hint solve moves (${movesApplied}) !== expectedMinMoves (${level.expectedMinMoves})`,
    );
    const sim = simulateWaterFlow(board);
    assert.equal(
      sim.isValidSolution,
      true,
      `Level ${level.id} (${level.titleFa}) did not reach valid solution after hint solve`,
    );
    assert.equal(sim.leaks.length, 0, `Level ${level.id} (${level.titleFa}) has water leaks after solve`);
  }
});

test('three-star scoring awards 3, 2, and 1 stars accurately', () => {
  const perfect = calculateLevelScore({
    rotations: 6,
    expectedMinMoves: 6,
    elapsedSeconds: 20,
    parTimeSec: 35,
    hintsUsed: 0,
  });
  assert.equal(perfect.stars, 3);
  assert.ok(perfect.score >= 1600);

  const twoStar = calculateLevelScore({
    rotations: 10,
    expectedMinMoves: 6,
    elapsedSeconds: 45,
    parTimeSec: 35,
    hintsUsed: 1,
  });
  assert.equal(twoStar.stars, 2);

  const oneStar = calculateLevelScore({
    rotations: 28,
    expectedMinMoves: 6,
    elapsedSeconds: 180,
    parTimeSec: 35,
    hintsUsed: 3,
  });
  assert.equal(oneStar.stars, 1);
  assert.ok(oneStar.score >= 100);

  assert.equal(toPersianDigits(123), '۱۲۳');
  assert.equal(formatTimePersian(65), '۰۱:۰۵');
});

test('LocalStorage persistence stores and restores progress and settings safely', () => {
  const mem = createMemoryStorage();
  const initial = loadProgress(mem);
  assert.deepEqual(initial, createDefaultProgress());

  const score = calculateLevelScore({
    rotations: 6,
    expectedMinMoves: 6,
    elapsedSeconds: 22,
    parTimeSec: 35,
    hintsUsed: 0,
  });
  recordLevelCompletion(initial, 1, score, 2, mem);

  const restored = loadProgress(mem);
  assert.equal(restored.lastPlayedLevelId, 2);
  assert.equal(restored.levels[1].completed, true);
  assert.equal(restored.levels[1].bestStars, 3);
  assert.equal(restored.levels[1].bestScore, score.score);

  saveSettings({ ...DEFAULT_SETTINGS, soundEnabled: false }, mem);
  const restoredSettings = loadSettings(mem);
  assert.equal(restoredSettings.soundEnabled, false);
  assert.equal(restoredSettings.animationsEnabled, true);

  // Corrupted JSON resilience
  mem.setItem(PROGRESS_STORAGE_KEY, '{broken-json');
  assert.deepEqual(loadProgress(mem), createDefaultProgress());

  clearProgress(mem);
  assert.deepEqual(loadProgress(mem), createDefaultProgress());
});
