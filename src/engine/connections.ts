import type { Direction, GridPosition, Rotation, TileType } from './types';

export const ALL_DIRECTIONS: readonly Direction[] = ['N', 'E', 'S', 'W'] as const;

const DIRECTION_INDEX: Record<Direction, number> = {
  N: 0,
  E: 1,
  S: 2,
  W: 3,
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  N: 'S',
  E: 'W',
  S: 'N',
  W: 'E',
};

export const DIRECTION_DELTA: Record<Direction, GridPosition> = {
  N: { row: -1, col: 0 },
  E: { row: 0, col: 1 },
  S: { row: 1, col: 0 },
  W: { row: 0, col: -1 },
};

/**
 * Base directional ports for each tile type at rotation 0 degrees.
 */
export const BASE_PORTS: Record<TileType, readonly Direction[]> = {
  straight: ['N', 'S'],
  corner: ['N', 'E'],
  tee: ['N', 'E', 'W'],
  cross: ['N', 'E', 'S', 'W'],
  source: ['E'],
  destination: ['W'],
  blocked: [],
  empty: [],
};

export function tileKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function isPipeTile(type: TileType): boolean {
  return type === 'straight' || type === 'corner' || type === 'tee' || type === 'cross';
}

export function isRotatableTile(type: TileType, locked: boolean): boolean {
  if (locked) return false;
  return isPipeTile(type);
}

/**
 * Rotate a single direction clockwise by a 90-degree multiple.
 */
export function rotateDirection(dir: Direction, rotation: Rotation): Direction {
  const steps = (rotation / 90) % 4;
  const idx = (DIRECTION_INDEX[dir] + steps) % 4;
  return ALL_DIRECTIONS[idx];
}

/**
 * Rotate a tile rotation value 90 degrees clockwise.
 */
export function rotateClockwise(rotation: Rotation): Rotation {
  return (((rotation + 90) % 360) as Rotation);
}

/**
 * Return the exact active connection ports for a tile given its type and clockwise rotation.
 */
export function getTilePorts(type: TileType, rotation: Rotation): Direction[] {
  const base = BASE_PORTS[type];
  if (base.length === 0) return [];
  return base.map((dir) => rotateDirection(dir, rotation));
}

/**
 * Check whether two rotations produce the exact same set of active connection ports
 * for a given tile type (e.g. straight pipes repeat every 180 deg, cross pipes repeat every 90 deg).
 */
export function areRotationsEquivalent(
  type: TileType,
  rotA: Rotation,
  rotB: Rotation,
): boolean {
  if (rotA === rotB) return true;
  if (type === 'cross' || type === 'blocked' || type === 'empty') return true;
  if (type === 'straight') {
    return rotA % 180 === rotB % 180;
  }
  return false;
}

/**
 * Calculate the minimum number of 90-degree clockwise taps needed to transform
 * `fromRotation` into a rotation functionally equivalent to `targetRotation`.
 */
export function minClockwiseRotations(
  type: TileType,
  fromRotation: Rotation,
  targetRotation: Rotation,
): number {
  if (areRotationsEquivalent(type, fromRotation, targetRotation)) {
    return 0;
  }
  let current = fromRotation;
  for (let taps = 1; taps <= 3; taps++) {
    current = rotateClockwise(current);
    if (areRotationsEquivalent(type, current, targetRotation)) {
      return taps;
    }
  }
  return 0;
}

export function getNeighborPosition(
  row: number,
  col: number,
  direction: Direction,
): GridPosition {
  const delta = DIRECTION_DELTA[direction];
  return {
    row: row + delta.row,
    col: col + delta.col,
  };
}

export function isWithinBounds(
  row: number,
  col: number,
  rows: number,
  cols: number,
): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}
