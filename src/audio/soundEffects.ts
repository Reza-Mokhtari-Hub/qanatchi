/**
 * Lightweight, dependency-free Web Audio API procedural sound synthesizer
 * crafted for QANATCHI (قنات‌چی) with:
 * - Zero external audio assets or third-party libraries
 * - Explicit user-interaction gating (no autoplay before user gesture)
 * - Per-effect cooldown throttling & soft master gain ceiling to avoid harsh overlap
 * - Graceful fallback when Web Audio API is unavailable (SSR / restricted browsers)
 * - Clean resource disposal
 */

export type SoundEffectId =
  | 'rotate'
  | 'button'
  | 'flowStart'
  | 'flowStep'
  | 'destination'
  | 'leak'
  | 'hint'
  | 'star'
  | 'victory';

interface SoundCooldownConfig {
  readonly minIntervalMs: number;
}

const SOUND_COOLDOWNS: Record<SoundEffectId, SoundCooldownConfig> = {
  rotate: { minIntervalMs: 48 },
  button: { minIntervalMs: 55 },
  flowStart: { minIntervalMs: 180 },
  flowStep: { minIntervalMs: 95 },
  destination: { minIntervalMs: 140 },
  leak: { minIntervalMs: 220 },
  hint: { minIntervalMs: 160 },
  star: { minIntervalMs: 70 },
  victory: { minIntervalMs: 400 },
};

// Warm Persian-inspired scale (Dastgah-e Shur / Bayat-inspired gentle frequencies in Hz)
const FLOW_STEP_NOTES = [293.66, 329.63, 349.23, 392.0, 440.0, 466.16, 523.25, 587.33];
const STAR_CHIME_NOTES = [523.25, 659.25, 783.99];

export interface SoundEngineClock {
  now: () => number;
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private unlocked = false;
  private lastPlayedAt: Partial<Record<SoundEffectId, number>> = {};
  private activeTimerIds = new Set<number>();
  private readonly clock: SoundEngineClock;

  constructor(clock: SoundEngineClock = { now: () => Date.now() }) {
    this.clock = clock;
  }

  /**
   * Marks the audio engine as user-unlocked (call from pointer/key interaction handlers).
   * Never creates or resumes AudioContext prior to genuine user interaction.
   */
  public unlock(): void {
    this.unlocked = true;
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
  }

  public isUnlocked(): boolean {
    return this.unlocked;
  }

  /**
   * Checks per-effect cooldown throttling so rapid taps never stack harshly.
   */
  public canTrigger(id: SoundEffectId): boolean {
    const now = this.clock.now();
    const prev = this.lastPlayedAt[id];
    const minGap = SOUND_COOLDOWNS[id].minIntervalMs;
    if (typeof prev === 'number' && now - prev < minGap) {
      return false;
    }
    this.lastPlayedAt[id] = now;
    return true;
  }

  private getAudioDestination(): { ctx: AudioContext; out: AudioNode } | null {
    if (!this.unlocked || typeof window === 'undefined') return null;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    try {
      if (!this.ctx || this.ctx.state === 'closed') {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        // Gentle master level ceiling so overlapping chimes stay calm and pleasant
        this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.noiseBuffer = null;
      }

      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {});
      }

      return { ctx: this.ctx, out: this.masterGain ?? this.ctx.destination };
    } catch {
      return null;
    }
  }

  private getSoftNoiseBuffer(ctx: AudioContext): AudioBuffer | null {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    try {
      const length = Math.floor(ctx.sampleRate * 0.35);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0;
      let b1 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        // Soft low-passed pink-like noise for natural flowing water texture
        b0 = 0.85 * b0 + white * 0.15;
        b1 = 0.92 * b1 + b0 * 0.08;
        data[i] = b1 * 2.2;
      }
      this.noiseBuffer = buffer;
      return buffer;
    } catch {
      return null;
    }
  }

  /** Warm carved-stone & ceramic click on tile rotation */
  public playRotate(enabled: boolean): boolean {
    if (!enabled) return false;
    this.unlock();
    if (!this.canTrigger('rotate')) return false;
    const audio = this.getAudioDestination();
    if (!audio) return false;

    const { ctx, out } = audio;
    const now = ctx.currentTime;
    const jitter = 0.95 + Math.random() * 0.1;

    // Low terracotta stone body thud
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(215 * jitter, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(118 * jitter, now + 0.065);
    bodyGain.gain.setValueAtTime(0.085, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.072);
    bodyOsc.connect(bodyGain);
    bodyGain.connect(out);
    bodyOsc.start(now);
    bodyOsc.stop(now + 0.076);

    // Subtle glazed ceramic overtone click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(640 * jitter, now);
    clickOsc.frequency.exponentialRampToValueAtTime(420 * jitter, now + 0.032);
    clickGain.gain.setValueAtTime(0.032, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.036);
    clickOsc.connect(clickGain);
    clickGain.connect(out);
    clickOsc.start(now);
    clickOsc.stop(now + 0.04);

    return true;
  }

  /** Soft wooden/ceramic tactile click for primary UI buttons & toggles */
  public playButtonClick(enabled: boolean): boolean {
    if (!enabled) return false;
    this.unlock();
    if (!this.canTrigger('button')) return false;
    const audio = this.getAudioDestination();
    if (!audio) return false;

    const { ctx, out } = audio;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.042);

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.046);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.05);
    return true;
  }

  /** Gentle rushing qanat water onset + shimmering turquoise swell */
  public playFlowStart(enabled: boolean): boolean {
    if (!enabled) return false;
    this.unlock();
    if (!this.canTrigger('flowStart')) return false;
    const audio = this.getAudioDestination();
    if (!audio) return false;

    const { ctx, out } = audio;
    const now = ctx.currentTime;

    // Soft filtered water-rush breath
    const buffer = this.getSoftNoiseBuffer(ctx);
    if (buffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(520, now);
      filter.frequency.exponentialRampToValueAtTime(1180, now + 0.28);
      filter.Q.setValueAtTime(1.4, now);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.001, now);
      nGain.gain.linearRampToValueAtTime(0.08, now + 0.06);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(out);
      noise.start(now);
      noise.stop(now + 0.34);
    }

    // Gentle ascending water-droplet motif
    const notes = [329.63, 440, 523.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.055;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.045, start);
      gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.16);

      osc.connect(gain);
      gain.connect(out);
      osc.start(start);
      osc.stop(start + 0.17);
    });

    return true;
  }

  /** Subtle pitch-ascending droplet pulse as water advances along connected pipes */
  public playFlowStep(enabled: boolean, stepIndex: number): boolean {
    if (!enabled || !this.unlocked) return false;
    if (!this.canTrigger('flowStep')) return false;
    const audio = this.getAudioDestination();
    if (!audio) return false;

    const { ctx, out } = audio;
    const now = ctx.currentTime;
    const safeIdx = Math.max(0, Math.min(FLOW_STEP_NOTES.length - 1, stepIndex));
    const freq = FLOW_STEP_NOTES[safeIdx];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.92, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.055);

    gain.gain.setValueAtTime(0.032, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.11);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.12);
    return true;
  }

  /** Warm resonant chime when water reaches a destination basin */
  public playDestinationReached(enabled: boolean): boolean {
    if (!enabled || !this.unlocked) return false;
    if (!this.canTrigger('destination')) return false;
    const audio = this.getAudioDestination();
    if (!audio) return false;

    const { ctx, out } = audio;
    const now = ctx.currentTime;
    const notes = [523.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.05;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.055, start);
      gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.28);

      osc.connect(gain);
      gain.connect(out);
      osc.start(start);
      osc.stop(start + 0.3);
    });
    return true;
  }

  /** Gentle low dampened splash when a leak or dead-end interrupts flow */
  public playLeak(enabled: boolean): boolean {
    if (!enabled || !this.unlocked) return false;
    if (!this.canTrigger('leak')) return false;
    const audio = this.getAudioDestination();
    if (!audio) return false;

    const { ctx, out } = audio;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(112, now + 0.22);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(540, now);

    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.24);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.25);
    return true;
  }

  /** Warm santur-like golden harmonic chime on hint request */
  public playHint(enabled: boolean): boolean {
    if (!enabled) return false;
    this.unlock();
    if (!this.canTrigger('hint')) return false;
    const audio = this.getAudioDestination();
    if (!audio) return false;

    const { ctx, out } = audio;
    const now = ctx.currentTime;

    [587.33, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.045;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.05, start);
      gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.22);

      osc.connect(gain);
      gain.connect(out);
      osc.start(start);
      osc.stop(start + 0.23);
    });
    return true;
  }

  /** Crystalline ascending star chime (index 0..2) */
  public playStar(enabled: boolean, starIndex: number): boolean {
    if (!enabled || !this.unlocked) return false;
    if (!this.canTrigger('star')) return false;
    const audio = this.getAudioDestination();
    if (!audio) return false;

    const { ctx, out } = audio;
    const now = ctx.currentTime;
    const clampedIdx = Math.max(0, Math.min(STAR_CHIME_NOTES.length - 1, starIndex));
    const freq = STAR_CHIME_NOTES[clampedIdx];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.3);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.32);
    return true;
  }

  /** Celebratory warm Persian ascending arpeggio on puzzle completion */
  public playVictory(enabled: boolean): boolean {
    if (!enabled || !this.unlocked) return false;
    if (!this.canTrigger('victory')) return false;
    const audio = this.getAudioDestination();
    if (!audio) return false;

    const { ctx, out } = audio;
    const now = ctx.currentTime;
    const notes = [392.0, 493.88, 587.33, 783.99, 987.77];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.085;

      osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.068, start);
      gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.48);

      osc.connect(gain);
      gain.connect(out);
      osc.start(start);
      osc.stop(start + 0.5);
    });
    return true;
  }

  /** Schedules staggered star chimes with tracked cleanup timers */
  public playStarCascade(enabled: boolean, stars: number): void {
    if (!enabled || !this.unlocked || stars <= 0 || typeof window === 'undefined') return;
    const clamped = Math.min(3, Math.max(0, Math.round(stars)));
    for (let i = 0; i < clamped; i++) {
      const id = window.setTimeout(() => {
        this.activeTimerIds.delete(id);
        this.playStar(enabled, i);
      }, 220 + i * 150);
      this.activeTimerIds.add(id);
    }
  }

  public clearScheduled(): void {
    if (typeof window !== 'undefined') {
      for (const id of this.activeTimerIds) {
        window.clearTimeout(id);
      }
    }
    this.activeTimerIds.clear();
  }

  public dispose(): void {
    this.clearScheduled();
    if (this.ctx && this.ctx.state !== 'closed') {
      void this.ctx.close().catch(() => {});
    }
    this.ctx = null;
    this.masterGain = null;
    this.noiseBuffer = null;
    this.lastPlayedAt = {};
  }
}

export const soundEngine = new SoundEngine();
