import { isRotatableTile, minClockwiseRotations } from './connections';
import { simulateWaterFlow } from './simulator';
import type { LevelDefinition, SimulationResult, TileState } from './types';

export interface LevelVerificationReport {
  levelId: number;
  valid: boolean;
  errors: string[];
  computedMinMoves: number;
  initialAlreadySolved: boolean;
  solutionSimulation: SimulationResult | null;
}

/**
 * Build a TileState grid from a LevelDefinition using either initial or solution rotations.
 */
export function buildGridFromLevel(
  level: LevelDefinition,
  mode: 'initial' | 'solution',
): TileState[][] {
  return level.grid.map((rowDefs, r) =>
    rowDefs.map((def, c) => {
      const rotation = mode === 'initial' ? def.initialRotation : def.solutionRotation;
      const locked =
        def.locked ??
        (def.type === 'source' ||
          def.type === 'destination' ||
          def.type === 'blocked' ||
          def.type === 'empty');
      return {
        row: r,
        col: c,
        type: def.type,
        rotation,
        visualRotation: rotation,
        locked,
      };
    }),
  );
}

/**
 * Programmatically verify a handcrafted level:
 * 1. Dimensions match grid array sizes.
 * 2. Declared source & destination coordinates match actual tiles.
 * 3. Initial board is NOT already solved.
 * 4. Applying solution rotations yields a valid leak-free solution reaching all destinations.
 * 5. Exact minimum clockwise rotations match `expectedMinMoves`.
 */
export function verifyLevel(level: LevelDefinition): LevelVerificationReport {
  const errors: string[] = [];

  if (level.grid.length !== level.rows) {
    errors.push(`Expected ${level.rows} rows, found ${level.grid.length}.`);
  }
  for (let r = 0; r < level.grid.length; r++) {
    if (level.grid[r].length !== level.cols) {
      errors.push(`Row ${r} expected ${level.cols} cols, found ${level.grid[r].length}.`);
    }
  }

  if (errors.length > 0) {
    return {
      levelId: level.id,
      valid: false,
      errors,
      computedMinMoves: 0,
      initialAlreadySolved: false,
      solutionSimulation: null,
    };
  }

  const sourceTile = level.grid[level.source.row]?.[level.source.col];
  if (!sourceTile || sourceTile.type !== 'source') {
    errors.push(
      `Source mismatch at (${level.source.row}, ${level.source.col}).`,
    );
  }

  if (level.destinations.length === 0) {
    errors.push('Level must define at least one destination.');
  }

  for (const dest of level.destinations) {
    const destTile = level.grid[dest.row]?.[dest.col];
    if (!destTile || destTile.type !== 'destination') {
      errors.push(`Destination mismatch at (${dest.row}, ${dest.col}).`);
    }
  }

  const initialGrid = buildGridFromLevel(level, 'initial');
  const solutionGrid = buildGridFromLevel(level, 'solution');

  const initialSim = simulateWaterFlow(initialGrid);
  const initialAlreadySolved = initialSim.isValidSolution;
  if (initialAlreadySolved) {
    errors.push('Initial level configuration is already solved.');
  }

  const solutionSim = simulateWaterFlow(solutionGrid);
  if (!solutionSim.allDestinationsReached) {
    errors.push(
      `Solution does not reach all destinations (unreached: ${solutionSim.unreachedDestinations.length}).`,
    );
  }
  if (solutionSim.leaks.length > 0) {
    errors.push(
      `Solution has ${solutionSim.leaks.length} water leak(s): ${solutionSim.leaks
        .map((l) => `(${l.row},${l.col})->${l.direction}:${l.reason}`)
        .join(', ')}`,
    );
  }
  if (!solutionSim.isValidSolution) {
    errors.push('Solution simulation failed isValidSolution check.');
  }

  let computedMinMoves = 0;
  for (let r = 0; r < level.rows; r++) {
    for (let c = 0; c < level.cols; c++) {
      const def = level.grid[r][c];
      const locked =
        def.locked ??
        (def.type === 'source' ||
          def.type === 'destination' ||
          def.type === 'blocked' ||
          def.type === 'empty');
      if (isRotatableTile(def.type, locked)) {
        computedMinMoves += minClockwiseRotations(
          def.type,
          def.initialRotation,
          def.solutionRotation,
        );
      }
    }
  }

  if (computedMinMoves !== level.expectedMinMoves) {
    errors.push(
      `expectedMinMoves (${level.expectedMinMoves}) does not match computedMinMoves (${computedMinMoves}).`,
    );
  }

  return {
    levelId: level.id,
    valid: errors.length === 0,
    errors,
    computedMinMoves,
    initialAlreadySolved,
    solutionSimulation: solutionSim,
  };
}
