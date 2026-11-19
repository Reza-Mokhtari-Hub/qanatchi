import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDirectionalWaterSegments } from './flowVisuals';
import { resolveEffectiveAnimationsEnabled } from '../hooks/usePrefersReducedMotion';

test('buildDirectionalWaterSegments generates exact BFS-aligned paths for source, straight, corner, tee, leaks, and destination', () => {
  // Source flowing East
  const srcSegs = buildDirectionalWaterSegments('source', {
    row: 0,
    col: 0,
    step: 0,
    enteredFrom: null,
    exitsTo: ['E'],
    leakDirections: [],
  });
  assert.equal(srcSegs.length, 1);
  assert.equal(srcSegs[0].d, 'M 50 50 L 100 50');

  // Straight pipe flowing West -> East
  const straightSegs = buildDirectionalWaterSegments('straight', {
    row: 0,
    col: 1,
    step: 1,
    enteredFrom: 'W',
    exitsTo: ['E'],
    leakDirections: [],
  });
  assert.equal(straightSegs.length, 1);
  assert.equal(straightSegs[0].d, 'M 0 50 L 100 50');

  // Corner pipe bending West -> South
  const cornerSegs = buildDirectionalWaterSegments('corner', {
    row: 0,
    col: 2,
    step: 2,
    enteredFrom: 'W',
    exitsTo: ['S'],
    leakDirections: [],
  });
  assert.equal(cornerSegs.length, 1);
  assert.equal(cornerSegs[0].d, 'M 0 50 Q 50 50 50 100');

  // Tee junction splitting North -> East (valid) and West (leak)
  const teeSegs = buildDirectionalWaterSegments('tee', {
    row: 1,
    col: 2,
    step: 3,
    enteredFrom: 'N',
    exitsTo: ['E'],
    leakDirections: ['W'],
  });
  assert.equal(teeSegs.length, 3);
  assert.equal(teeSegs[0].phase, 'entry');
  assert.equal(teeSegs[0].d, 'M 50 0 L 50 50');
  assert.deepEqual(
    teeSegs.slice(1).map((s) => s.d),
    ['M 50 50 L 100 50', 'M 50 50 L 0 50'],
  );

  // Destination receiving water from West
  const dstSegs = buildDirectionalWaterSegments('destination', {
    row: 1,
    col: 3,
    step: 4,
    enteredFrom: 'W',
    exitsTo: [],
    leakDirections: [],
  });
  assert.equal(dstSegs.length, 1);
  assert.equal(dstSegs[0].d, 'M 0 50 L 50 50');
});

test('resolveEffectiveAnimationsEnabled honors both user preference and OS prefers-reduced-motion', () => {
  assert.equal(resolveEffectiveAnimationsEnabled(true, false), true);
  assert.equal(resolveEffectiveAnimationsEnabled(false, false), false);
  assert.equal(resolveEffectiveAnimationsEnabled(true, true), false);
  assert.equal(resolveEffectiveAnimationsEnabled(false, true), false);
});
