import type { Direction, FlowTileStep, TileType } from '../engine/types';

export interface WaterSegment {
  id: string;
  /** SVG path string inside a 100x100 tile viewBox, oriented in exact flow travel direction. */
  d: string;
  /** Approximate path length for smooth stroke-dashoffset draw timing. */
  length: number;
  /** Whether this segment enters from an edge to center or exits center to an edge/port. */
  phase: 'entry' | 'exit' | 'through';
}

const EDGE_POINT: Record<Direction, { x: number; y: number }> = {
  N: { x: 50, y: 0 },
  E: { x: 100, y: 50 },
  S: { x: 50, y: 100 },
  W: { x: 0, y: 50 },
};

const OPPOSITE: Record<Direction, Direction> = {
  N: 'S',
  E: 'W',
  S: 'N',
  W: 'E',
};

function isOpposite(a: Direction, b: Direction): boolean {
  return OPPOSITE[a] === b;
}

/**
 * Computes world-space SVG water flow segments oriented in the exact direction
 * computed by the BFS water simulator (`enteredFrom` -> center -> `exitsTo` / `leakDirections`).
 *
 * Pure visual helper — never modifies tile state or simulation output.
 */
export function buildDirectionalWaterSegments(
  tileType: TileType,
  flowStep: FlowTileStep | undefined,
): WaterSegment[] {
  if (!flowStep) return [];

  const { enteredFrom, exitsTo, leakDirections } = flowStep;
  const outgoing: Direction[] = [...exitsTo, ...leakDirections];

  // Source tile: starts from center (50,50) and pushes water out its open port
  if (tileType === 'source') {
    return outgoing.map((dir) => {
      const end = EDGE_POINT[dir];
      return {
        id: `src-${dir}`,
        d: `M 50 50 L ${end.x} ${end.y}`,
        length: 50,
        phase: 'exit',
      };
    });
  }

  // Destination tile: receives water from entry edge into the center oasis pool
  if (tileType === 'destination') {
    if (!enteredFrom) return [];
    const start = EDGE_POINT[enteredFrom];
    return [
      {
        id: `dst-${enteredFrom}`,
        d: `M ${start.x} ${start.y} L 50 50`,
        length: 50,
        phase: 'entry',
      },
    ];
  }

  // Simple single-exit straight or corner pipe: render one continuous flowing curve/line
  if (enteredFrom && outgoing.length === 1) {
    const exitDir = outgoing[0];
    const start = EDGE_POINT[enteredFrom];
    const end = EDGE_POINT[exitDir];

    if (isOpposite(enteredFrom, exitDir)) {
      return [
        {
          id: `through-${enteredFrom}-${exitDir}`,
          d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
          length: 100,
          phase: 'through',
        },
      ];
    }

    // Smooth quadratic bend matching the carved corner pipe radius
    return [
      {
        id: `bend-${enteredFrom}-${exitDir}`,
        d: `M ${start.x} ${start.y} Q 50 50 ${end.x} ${end.y}`,
        length: 84,
        phase: 'through',
      },
    ];
  }

  // Branching tiles (tee / cross) or dead-end entry: draw entry arm first, then exit arms
  const segments: WaterSegment[] = [];
  if (enteredFrom) {
    const start = EDGE_POINT[enteredFrom];
    segments.push({
      id: `in-${enteredFrom}`,
      d: `M ${start.x} ${start.y} L 50 50`,
      length: 50,
      phase: 'entry',
    });
  }

  for (const dir of outgoing) {
    if (dir === enteredFrom) continue;
    const end = EDGE_POINT[dir];
    segments.push({
      id: `out-${dir}`,
      d: `M 50 50 L ${end.x} ${end.y}`,
      length: 50,
      phase: 'exit',
    });
  }

  return segments;
}
