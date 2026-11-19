/**
 * Deterministic Hashing & Pseudo-Random Number Generation for QANATCHI Phase 3.
 *
 * - Hash: 32-bit FNV-1a (offset basis 2166136261, prime 16777619)
 * - PRNG: Mulberry32 (32-bit state -> deterministic uniform [0, 1))
 *
 * Pure integer bitwise arithmetic guarantees identical outputs across all browsers,
 * Node.js test environments, and future Edge runtimes.
 */

export function hashStringFNV1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function createMulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function nextInt(rng: () => number, minInclusive: number, maxExclusive: number): number {
  if (maxExclusive <= minInclusive) return minInclusive;
  return minInclusive + Math.floor(rng() * (maxExclusive - minInclusive));
}
