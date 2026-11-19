import type { Rotation, TileDefinition } from '../engine/types';

export const emp = (): TileDefinition => ({
  type: 'empty',
  initialRotation: 0,
  solutionRotation: 0,
  locked: true,
});

export const blk = (): TileDefinition => ({
  type: 'blocked',
  initialRotation: 0,
  solutionRotation: 0,
  locked: true,
});

export const src = (rotation: Rotation): TileDefinition => ({
  type: 'source',
  initialRotation: rotation,
  solutionRotation: rotation,
  locked: true,
});

export const dst = (rotation: Rotation): TileDefinition => ({
  type: 'destination',
  initialRotation: rotation,
  solutionRotation: rotation,
  locked: true,
});

export const str = (initialRotation: Rotation, solutionRotation: Rotation): TileDefinition => ({
  type: 'straight',
  initialRotation,
  solutionRotation,
  locked: false,
});

export const cor = (initialRotation: Rotation, solutionRotation: Rotation): TileDefinition => ({
  type: 'corner',
  initialRotation,
  solutionRotation,
  locked: false,
});

export const tee = (initialRotation: Rotation, solutionRotation: Rotation): TileDefinition => ({
  type: 'tee',
  initialRotation,
  solutionRotation,
  locked: false,
});

export const crs = (initialRotation: Rotation = 0): TileDefinition => ({
  type: 'cross',
  initialRotation,
  solutionRotation: 0,
  locked: false,
});
