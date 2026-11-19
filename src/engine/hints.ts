import { isRotatableTile, minClockwiseRotations } from './connections';
import type { HintSuggestion, LevelDefinition, TileState } from './types';

/**
 * Find the next rotatable pipe tile whose current rotation does not match
 * the verified level solution (accounting for pipe symmetry).
 */
export function getNextHint(
  level: LevelDefinition,
  currentGrid: TileState[][],
): HintSuggestion | null {
  for (let r = 0; r < level.rows; r++) {
    for (let c = 0; c < level.cols; c++) {
      const tile = currentGrid[r]?.[c];
      const def = level.grid[r]?.[c];
      if (!tile || !def) continue;
      if (!isRotatableTile(tile.type, tile.locked)) continue;

      const taps = minClockwiseRotations(tile.type, tile.rotation, def.solutionRotation);
      if (taps > 0) {
        return {
          row: r,
          col: c,
          rotationsNeeded: taps,
          targetRotation: def.solutionRotation,
        };
      }
    }
  }
  return null;
}
