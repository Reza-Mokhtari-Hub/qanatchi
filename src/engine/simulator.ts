import {
  getNeighborPosition,
  getTilePorts,
  isPipeTile,
  isWithinBounds,
  OPPOSITE_DIRECTION,
  tileKey,
} from './connections';
import type {
  Direction,
  FlowTileStep,
  GridPosition,
  InvalidPathBranch,
  LeakPoint,
  SimulationResult,
  TileState,
} from './types';

interface QueueEntry {
  row: number;
  col: number;
  step: number;
}

/**
 * Reconstruct the path from a reached tile back to the source via parent pointers.
 */
function tracePathFromSource(
  endRow: number,
  endCol: number,
  parentMap: Map<string, GridPosition | null>,
): GridPosition[] {
  const path: GridPosition[] = [];
  const seen = new Set<string>();
  let cursor: GridPosition | null = { row: endRow, col: endCol };

  while (cursor) {
    const key = tileKey(cursor.row, cursor.col);
    if (seen.has(key)) break;
    seen.add(key);
    path.push(cursor);
    cursor = parentMap.get(key) ?? null;
  }

  return path.reverse();
}

/**
 * Run a deterministic Breadth-First Search (BFS) water simulation starting from all
 * source tiles on the grid.
 *
 * - Strictly enforces reciprocal port compatibility (e.g. N <-> S, E <-> W).
 * - Prevents infinite traversal through cycles using a visited tile set.
 * - Detects connected tiles, disconnected pipes, exact leak points, reached/unreached
 *   destinations, invalid leak branches, and overall solution validity.
 */
export function simulateWaterFlow(grid: TileState[][]): SimulationResult {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  const flowMap: Record<string, FlowTileStep> = {};
  const orderedSteps: FlowTileStep[] = [];
  const connectedTiles: GridPosition[] = [];
  const leaks: LeakPoint[] = [];
  const allDestinations: GridPosition[] = [];
  const parentMap = new Map<string, GridPosition | null>();

  const queue: QueueEntry[] = [];
  const visited = new Set<string>();

  // Locate sources and destinations
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = grid[r][c];
      if (tile.type === 'source') {
        const key = tileKey(r, c);
        if (!visited.has(key)) {
          visited.add(key);
          parentMap.set(key, null);
          const stepRecord: FlowTileStep = {
            row: r,
            col: c,
            step: 0,
            enteredFrom: null,
            exitsTo: [],
            leakDirections: [],
          };
          flowMap[key] = stepRecord;
          orderedSteps.push(stepRecord);
          connectedTiles.push({ row: r, col: c });
          queue.push({ row: r, col: c, step: 0 });
        }
      } else if (tile.type === 'destination') {
        allDestinations.push({ row: r, col: c });
      }
    }
  }

  let maxStep = 0;
  let head = 0;

  while (head < queue.length) {
    const current = queue[head++];
    const currentTile = grid[current.row][current.col];
    const currentKey = tileKey(current.row, current.col);
    const currentRecord = flowMap[currentKey];
    const ports = getTilePorts(currentTile.type, currentTile.rotation);

    if (current.step > maxStep) {
      maxStep = current.step;
    }

    for (const dir of ports) {
      // Do not double-count the incoming port as an exit or leak
      if (currentRecord.enteredFrom === dir) {
        continue;
      }

      const neighborPos = getNeighborPosition(current.row, current.col, dir);

      if (!isWithinBounds(neighborPos.row, neighborPos.col, rows, cols)) {
        currentRecord.leakDirections.push(dir);
        leaks.push({
          row: current.row,
          col: current.col,
          direction: dir,
          reason: 'boundary',
        });
        continue;
      }

      const neighborTile = grid[neighborPos.row][neighborPos.col];

      if (neighborTile.type === 'blocked') {
        currentRecord.leakDirections.push(dir);
        leaks.push({
          row: current.row,
          col: current.col,
          direction: dir,
          reason: 'blocked',
        });
        continue;
      }

      if (neighborTile.type === 'empty') {
        currentRecord.leakDirections.push(dir);
        leaks.push({
          row: current.row,
          col: current.col,
          direction: dir,
          reason: 'empty',
        });
        continue;
      }

      const reciprocal = OPPOSITE_DIRECTION[dir];
      const neighborPorts = getTilePorts(neighborTile.type, neighborTile.rotation);

      if (!neighborPorts.includes(reciprocal)) {
        currentRecord.leakDirections.push(dir);
        leaks.push({
          row: current.row,
          col: current.col,
          direction: dir,
          reason: 'mismatch',
        });
        continue;
      }

      // Valid compatible connection!
      currentRecord.exitsTo.push(dir);

      const neighborKey = tileKey(neighborPos.row, neighborPos.col);
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        parentMap.set(neighborKey, { row: current.row, col: current.col });
        const nextStep = current.step + 1;
        if (nextStep > maxStep) {
          maxStep = nextStep;
        }
        const neighborRecord: FlowTileStep = {
          row: neighborPos.row,
          col: neighborPos.col,
          step: nextStep,
          enteredFrom: reciprocal,
          exitsTo: [],
          leakDirections: [],
        };
        flowMap[neighborKey] = neighborRecord;
        orderedSteps.push(neighborRecord);
        connectedTiles.push({ row: neighborPos.row, col: neighborPos.col });
        queue.push({ row: neighborPos.row, col: neighborPos.col, step: nextStep });
      }
    }
  }

  // Collect disconnected pipe tiles
  const disconnectedPipeTiles: GridPosition[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = grid[r][c];
      if (isPipeTile(tile.type) && !visited.has(tileKey(r, c))) {
        disconnectedPipeTiles.push({ row: r, col: c });
      }
    }
  }

  // Classify destinations
  const reachedDestinations: GridPosition[] = [];
  const unreachedDestinations: GridPosition[] = [];
  for (const dest of allDestinations) {
    if (visited.has(tileKey(dest.row, dest.col))) {
      reachedDestinations.push(dest);
    } else {
      unreachedDestinations.push(dest);
    }
  }

  const allDestinationsReached =
    allDestinations.length > 0 && unreachedDestinations.length === 0;

  // Build invalid leak branches for diagnostic inspection
  const invalidPaths: InvalidPathBranch[] = leaks.map((leak) => ({
    tiles: tracePathFromSource(leak.row, leak.col, parentMap),
    leak,
  }));

  const isValidSolution = allDestinationsReached && leaks.length === 0;

  return {
    flowMap,
    orderedSteps,
    maxStep,
    connectedTiles,
    disconnectedPipeTiles,
    leaks,
    reachedDestinations,
    unreachedDestinations,
    allDestinationsReached,
    invalidPaths,
    isValidSolution,
  };
}
