import { isRotatableTile, minClockwiseRotations, rotateClockwise } from '../engine/connections';
import { simulateWaterFlow } from '../engine/simulator';
import type {
  GridPosition,
  LevelDefinition,
  PuzzleTemplateDefinition,
  Rotation,
  TileDefinition,
  TileType,
} from '../engine/types';
import { buildGridFromLevel, verifyLevel } from '../engine/verifier';
import { createMulberry32, nextInt } from './prng';

function rotateRotationSteps(rot: Rotation, steps: number): Rotation {
  const normalized = ((rot + steps * 90) % 360 + 360) % 360;
  return normalized as Rotation;
}

/**
 * Exact horizontal mirror mapping (swapping East <-> West while preserving North & South)
 * for every QANATCHI tile type based on BASE_PORTS.
 */
function mirrorRotationHorizontal(type: TileType, rot: Rotation): Rotation {
  switch (type) {
    case 'straight':
    case 'cross':
    case 'blocked':
    case 'empty':
      return rot;
    case 'corner':
      return (((270 - rot) % 360) + 360) % 360 as Rotation;
    case 'tee':
      return (((360 - rot) % 360) + 360) % 360 as Rotation;
    case 'source':
    case 'destination':
      return (((180 - rot) % 360) + 360) % 360 as Rotation;
  }
}

function rotateGridClockwiseOnce(grid: TileDefinition[][]): TileDefinition[][] {
  const size = grid.length;
  const result: TileDefinition[][] = Array.from({ length: size }, () => new Array<TileDefinition>(size));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const tile = grid[r][c];
      const nextR = c;
      const nextC = size - 1 - r;
      result[nextR][nextC] = {
        ...tile,
        initialRotation: rotateRotationSteps(tile.initialRotation, 1),
        solutionRotation: rotateRotationSteps(tile.solutionRotation, 1),
      };
    }
  }
  return result;
}

function flipGridHorizontal(grid: TileDefinition[][]): TileDefinition[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const tile = grid[r][cols - 1 - c];
      return {
        ...tile,
        initialRotation: mirrorRotationHorizontal(tile.type, tile.initialRotation),
        solutionRotation: mirrorRotationHorizontal(tile.type, tile.solutionRotation),
      };
    }),
  );
}

function isEffectiveRotatable(def: TileDefinition): boolean {
  const locked =
    def.locked ??
    (def.type === 'source' ||
      def.type === 'destination' ||
      def.type === 'blocked' ||
      def.type === 'empty');
  if (!isRotatableTile(def.type, locked)) return false;
  // Rotating a cross pipe does not change its ports, so exclude it from move scrambling
  return def.type !== 'cross';
}

function computeMovesForGrid(grid: TileDefinition[][]): number {
  let moves = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const def = grid[r][c];
      const locked =
        def.locked ??
        (def.type === 'source' ||
          def.type === 'destination' ||
          def.type === 'blocked' ||
          def.type === 'empty');
      if (isRotatableTile(def.type, locked)) {
        moves += minClockwiseRotations(def.type, def.initialRotation, def.solutionRotation);
      }
    }
  }
  return moves;
}

export interface GeneratedLevelOptions {
  syntheticLevelId: number;
  titleFa?: string;
  subtitleFa?: string;
}

/**
 * Deterministically transform a verified handcrafted square template using a 32-bit seed:
 * 1. Apply one of 8 dihedral symmetries (0/90/180/270 rotation + optional horizontal mirror).
 * 2. Deterministically scramble rotatable pipe initial orientations.
 * 3. Guarantee initial board is NOT already solved and compute exact expectedMinMoves.
 * 4. Validate the generated LevelDefinition with the engine's `verifyLevel()` verifier.
 */
export function buildDeterministicLevelFromTemplate(
  template: PuzzleTemplateDefinition,
  seed: number,
  options: GeneratedLevelOptions,
): LevelDefinition {
  const rng = createMulberry32(seed >>> 0);
  const isSquare = template.rows === template.cols;

  let transformedGrid: TileDefinition[][] = template.grid.map((row) =>
    row.map((tile) => ({ ...tile })),
  );

  // Step 1: Symmetry-preserving board transformation (D4 group for square boards)
  if (isSquare) {
    const rotSteps = nextInt(rng, 0, 4);
    for (let i = 0; i < rotSteps; i++) {
      transformedGrid = rotateGridClockwiseOnce(transformedGrid);
    }
  }
  const shouldFlip = nextInt(rng, 0, 2) === 1;
  if (shouldFlip) {
    transformedGrid = flipGridHorizontal(transformedGrid);
  }

  // Step 2: Deterministic scrambling of rotatable pipes
  const rotatableCoords: GridPosition[] = [];
  for (let r = 0; r < transformedGrid.length; r++) {
    for (let c = 0; c < transformedGrid[r].length; c++) {
      const tile = transformedGrid[r][c];
      if (!isEffectiveRotatable(tile)) continue;
      rotatableCoords.push({ row: r, col: c });

      if (tile.type === 'straight') {
        // 75% chance to rotate 90 deg from solution so straight pipes require action
        const rotateOff = rng() < 0.75;
        tile.initialRotation = rotateOff
          ? rotateClockwise(tile.solutionRotation)
          : tile.solutionRotation;
      } else {
        // corner or tee: 82% chance to be offset by 1, 2, or 3 clockwise steps
        if (rng() < 0.82) {
          const offsetSteps = nextInt(rng, 1, 4);
          tile.initialRotation = rotateRotationSteps(tile.solutionRotation, offsetSteps);
        } else {
          tile.initialRotation = tile.solutionRotation;
        }
      }
    }
  }

  // Locate transformed source & destination coordinates directly from grid
  let source: GridPosition = { row: 0, col: 0 };
  const destinations: GridPosition[] = [];
  for (let r = 0; r < transformedGrid.length; r++) {
    for (let c = 0; c < transformedGrid[r].length; c++) {
      if (transformedGrid[r][c].type === 'source') {
        source = { row: r, col: c };
      } else if (transformedGrid[r][c].type === 'destination') {
        destinations.push({ row: r, col: c });
      }
    }
  }

  // Step 3: Ensure initial board is never already solved
  const draftLevel: LevelDefinition = {
    id: options.syntheticLevelId,
    regionId: 'yazd',
    titleFa: options.titleFa ?? template.titleFa,
    subtitleFa: options.subtitleFa ?? template.introFa,
    difficulty: template.difficulty,
    rows: transformedGrid.length,
    cols: transformedGrid[0].length,
    source,
    destination: destinations[0] ?? { row: 0, col: 0 },
    destinations,
    expectedMinMoves: computeMovesForGrid(transformedGrid),
    parTimeSec: template.parTimeSec,
    grid: transformedGrid,
  };

  const initialSim = simulateWaterFlow(buildGridFromLevel(draftLevel, 'initial'));
  if (initialSim.isValidSolution && rotatableCoords.length > 0) {
    // Deterministically perturb the first rotatable pipe so initial state is never solved
    const first = rotatableCoords[0];
    const targetTile = transformedGrid[first.row][first.col];
    targetTile.initialRotation = rotateClockwise(targetTile.solutionRotation);
    draftLevel.expectedMinMoves = computeMovesForGrid(transformedGrid);
  }

  // Step 4: Mandatory verification via the core engine verifier
  const verification = verifyLevel(draftLevel);
  if (!verification.valid) {
    throw new Error(
      `Generated puzzle failed verification for template "${template.id}" (seed=${seed}): ${verification.errors.join('; ')}`,
    );
  }

  return draftLevel;
}
