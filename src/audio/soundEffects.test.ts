import test from 'node:test';
import assert from 'node:assert/strict';
import { SoundEngine } from './soundEffects';

test('SoundEngine respects mute flag, prevents pre-interaction autoplay, and degrades gracefully without Web Audio', () => {
  let now = 1000;
  const engine = new SoundEngine({ now: () => now });

  // Before any user interaction, engine is locked and background effects do not autoplay
  assert.equal(engine.isUnlocked(), false);
  assert.equal(engine.playFlowStep(true, 0), false);
  assert.equal(engine.playVictory(true), false);
  assert.equal(engine.playLeak(true), false);
  assert.equal(engine.playStar(true, 0), false);

  // Disabled sound never unlocks or plays
  assert.equal(engine.playRotate(false), false);
  assert.equal(engine.isUnlocked(), false);

  // User interaction unlocks, and missing window.AudioContext degrades cleanly without throwing
  assert.equal(engine.playRotate(true), false); // no window/AudioContext in Node
  assert.equal(engine.isUnlocked(), true);

  // Per-effect cooldown throttling prevents harsh rapid overlap
  now = 2000;
  assert.equal(engine.canTrigger('rotate'), true);
  now = 2020; // within 48ms cooldown
  assert.equal(engine.canTrigger('rotate'), false);
  now = 2060; // past cooldown
  assert.equal(engine.canTrigger('rotate'), true);

  // Clean disposal resets cooldown table without throwing
  engine.dispose();
  assert.equal(engine.canTrigger('rotate'), true);
});
