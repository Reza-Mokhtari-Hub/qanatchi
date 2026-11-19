import { useCallback, useEffect, useRef, useState } from 'react';
import type { SimulationResult } from '../engine/types';

export type FlowAnimationPhase = 'idle' | 'flowing' | 'failed' | 'victory';

export interface FlowAnimationOptions {
  animationsEnabled: boolean;
  onStep?: (step: number, result: SimulationResult) => void;
  onComplete: (result: SimulationResult) => void;
}

export interface WaterFlowAnimationState {
  phase: FlowAnimationPhase;
  simulation: SimulationResult | null;
  /** Highest BFS step currently illuminated by animated water (-1 when idle). */
  visibleStep: number;
  startFlowAnimation: (
    result: SimulationResult,
    options: FlowAnimationOptions,
  ) => void;
  resetFlowAnimation: () => void;
}

const STEP_INTERVAL_MS = 120;

/**
 * Animates water flowing sequentially along the BFS-validated path from source to
 * each reached tile step-by-step, revealing leaks or oasis completion only when
 * the water front actually reaches the end of the path.
 */
export function useWaterFlowAnimation(): WaterFlowAnimationState {
  const [phase, setPhase] = useState<FlowAnimationPhase>('idle');
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [visibleStep, setVisibleStep] = useState<number>(-1);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const resetFlowAnimation = useCallback(() => {
    clearTimers();
    setPhase('idle');
    setSimulation(null);
    setVisibleStep(-1);
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const startFlowAnimation = useCallback(
    (result: SimulationResult, options: FlowAnimationOptions) => {
      clearTimers();
      setSimulation(result);

      if (!options.animationsEnabled) {
        setVisibleStep(result.maxStep);
        setPhase(result.isValidSolution ? 'victory' : 'failed');
        options.onComplete(result);
        return;
      }

      setPhase('flowing');
      setVisibleStep(0);
      options.onStep?.(0, result);

      for (let step = 1; step <= result.maxStep; step++) {
        const timerId = window.setTimeout(() => {
          setVisibleStep(step);
          options.onStep?.(step, result);
        }, step * STEP_INTERVAL_MS);
        timersRef.current.push(timerId);
      }

      const finalDelay = (result.maxStep + 1) * STEP_INTERVAL_MS + 140;
      const doneTimer = window.setTimeout(() => {
        setVisibleStep(result.maxStep);
        setPhase(result.isValidSolution ? 'victory' : 'failed');
        options.onComplete(result);
      }, finalDelay);
      timersRef.current.push(doneTimer);
    },
    [clearTimers],
  );

  return {
    phase,
    simulation,
    visibleStep,
    startFlowAnimation,
    resetFlowAnimation,
  };
}
