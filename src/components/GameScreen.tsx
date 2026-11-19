import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Compass,
  Droplets,
  Flame,
  Grid2X2,
  Lightbulb,
  Map,
  Pause,
  Play,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  verifyChallengeOnServer,
  type ServerVerifyResult,
} from '../api/edgeClient';
import { useWaterFlowAnimation } from '../animation/useWaterFlowAnimation';
import { soundEngine } from '../audio/soundEffects';
import { getDestinationForLevelId } from '../campaign/destinations';
import { DIFFICULTY_LABELS_FA, getRegionById } from '../campaign/regions';
import { calculateDailyScore } from '../engagement/dailyScoring';
import type { TileRotationAction } from '../engagement/solutionReplay';
import { isRotatableTile, rotateClockwise, tileKey } from '../engine/connections';
import { getNextHint } from '../engine/hints';
import { calculateLevelScore, formatTimePersian, toPersianDigits } from '../engine/scoring';
import { simulateWaterFlow } from '../engine/simulator';
import type {
  DailyScoreResult,
  GameMode,
  GameSettings,
  HintSuggestion,
  LevelDefinition,
  ScoreResult,
  SimulationResult,
  StoryMoment,
  TileState,
} from '../engine/types';
import { createInitialBoard, LEVELS } from '../levels/levels';
import { GameBoard } from './GameBoard';
import {
  AnimatedScoreCounter,
  AnimatedStarRow,
  VictoryCelebrationOrnament,
} from './VictoryEffects';

export interface ChallengeCompletionOutcome {
  isNewBest: boolean;
  currentStreak?: number;
}

export interface VerifiableChallengeMeta {
  challengeId: string;
  dateKey?: string;
  algoVersion: number;
}

interface GameScreenProps {
  level: LevelDefinition;
  mode?: GameMode;
  sessionKey?: string;
  challengeCode?: string;
  challengeSubtitleFa?: string;
  challengeMeta?: VerifiableChallengeMeta;
  previousBestScore?: number;
  settings: GameSettings;
  effectiveAnimationsEnabled: boolean;
  isPaused: boolean;
  onSetPaused: (paused: boolean) => void;
  onToggleSound: () => void;
  onLevelComplete: (levelId: number, result: ScoreResult) => StoryMoment | null;
  onChallengeComplete?: (result: DailyScoreResult) => ChallengeCompletionOutcome;
  onShareChallenge?: () => void;
  onReturnToModeHub?: () => void;
  onNextLevel: () => void;
  onOpenMap: () => void;
  onOpenLevels: () => void;
  onGoHome: () => void;
}

export function GameScreen({
  level,
  mode = 'campaign',
  sessionKey,
  challengeCode,
  challengeSubtitleFa,
  challengeMeta,
  previousBestScore = 0,
  settings,
  effectiveAnimationsEnabled,
  isPaused,
  onSetPaused,
  onToggleSound,
  onLevelComplete,
  onChallengeComplete,
  onShareChallenge,
  onReturnToModeHub,
  onNextLevel,
  onOpenMap,
  onOpenLevels,
  onGoHome,
}: GameScreenProps) {
  const [board, setBoard] = useState<TileState[][]>(() => createInitialBoard(level));
  const [rotations, setRotations] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [restartsCount, setRestartsCount] = useState<number>(0);
  const [activeHint, setActiveHint] = useState<HintSuggestion | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [victoryScore, setVictoryScore] = useState<ScoreResult | null>(null);
  const [campaignIsNewBest, setCampaignIsNewBest] = useState<boolean>(false);
  const [challengeVictoryScore, setChallengeVictoryScore] = useState<DailyScoreResult | null>(null);
  const [challengeOutcome, setChallengeOutcome] = useState<ChallengeCompletionOutcome | null>(null);
  const [victoryMilestone, setVictoryMilestone] = useState<StoryMoment | null>(null);
  const [serverVerifyLoading, setServerVerifyLoading] = useState<boolean>(false);
  const [serverVerifyResult, setServerVerifyResult] = useState<ServerVerifyResult | null>(null);
  const [lastRotatedKey, setLastRotatedKey] = useState<string | null>(null);
  const [lastRotatedSeq, setLastRotatedSeq] = useState<number>(0);

  const flowAnim = useWaterFlowAnimation();
  const hasCompletedRef = useRef<boolean>(false);
  const victoryDelayRef = useRef<number | null>(null);
  const actionsLogRef = useRef<TileRotationAction[]>([]);

  const isChallengeMode = mode === 'daily' || mode === 'friend';
  const region = getRegionById(level.regionId);
  const hasNextLevel = mode === 'campaign' && level.id < LEVELS.length;
  const effectiveSessionKey = sessionKey ?? `${mode}-${level.id}`;

  const clearVictoryDelay = useCallback(() => {
    if (victoryDelayRef.current !== null) {
      window.clearTimeout(victoryDelayRef.current);
      victoryDelayRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearVictoryDelay();
      soundEngine.clearScheduled();
    };
  }, [clearVictoryDelay]);

  // Reset entire board state whenever active puzzle/session changes
  useEffect(() => {
    clearVictoryDelay();
    soundEngine.clearScheduled();
    setBoard(createInitialBoard(level));
    setRotations(0);
    setElapsedSeconds(0);
    setHintsUsed(0);
    setRestartsCount(0);
    setActiveHint(null);
    setFeedbackMessage('');
    setVictoryScore(null);
    setCampaignIsNewBest(false);
    setChallengeVictoryScore(null);
    setChallengeOutcome(null);
    setVictoryMilestone(null);
    setServerVerifyLoading(false);
    setServerVerifyResult(null);
    setLastRotatedKey(null);
    setLastRotatedSeq(0);
    actionsLogRef.current = [];
    hasCompletedRef.current = false;
    flowAnim.resetFlowAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSessionKey]);

  const hasVictory = victoryScore !== null || challengeVictoryScore !== null;

  const triggerServerVerification = useCallback(async () => {
    if ((mode !== 'daily' && mode !== 'friend') || !challengeMeta) {
      return;
    }
    const actionsSnapshot = actionsLogRef.current.slice();
    setServerVerifyLoading(true);
    const res = await verifyChallengeOnServer({
      challengeType: mode,
      challengeId: challengeMeta.challengeId,
      dateKey: mode === 'daily' ? challengeMeta.dateKey : undefined,
      algoVersion: challengeMeta.algoVersion,
      actions: actionsSnapshot,
    });
    setServerVerifyResult(res);
    setServerVerifyLoading(false);
  }, [challengeMeta, mode]);

  // Active level timer (pauses during pause modal, victory, or flowing animation)
  useEffect(() => {
    if (
      isPaused ||
      hasVictory ||
      flowAnim.phase === 'flowing' ||
      flowAnim.phase === 'victory'
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPaused, hasVictory, flowAnim.phase]);

  const handleRestart = useCallback(
    (options?: { freshReplay?: boolean }) => {
      clearVictoryDelay();
      soundEngine.clearScheduled();
      soundEngine.playButtonClick(settings.soundEnabled);
      flowAnim.resetFlowAnimation();
      setBoard(createInitialBoard(level));
      setRotations(0);
      setElapsedSeconds(0);
      setHintsUsed(0);
      if (options?.freshReplay || hasVictory) {
        // Replaying after victory starts a clean new attempt with 0 restarts
        setRestartsCount(0);
      } else {
        setRestartsCount((prev) => prev + 1);
      }
      setActiveHint(null);
      setFeedbackMessage('');
      setVictoryScore(null);
      setCampaignIsNewBest(false);
      setChallengeVictoryScore(null);
      setChallengeOutcome(null);
      setVictoryMilestone(null);
      setServerVerifyLoading(false);
      setServerVerifyResult(null);
      setLastRotatedKey(null);
      setLastRotatedSeq(0);
      actionsLogRef.current = [];
      hasCompletedRef.current = false;
      onSetPaused(false);
    },
    [clearVictoryDelay, flowAnim, hasVictory, level, onSetPaused, settings.soundEnabled],
  );

  const handleRotateTile = useCallback(
    (row: number, col: number) => {
      if (
        isPaused ||
        hasVictory ||
        flowAnim.phase === 'flowing' ||
        flowAnim.phase === 'victory'
      ) {
        return;
      }

      if (flowAnim.phase === 'failed') {
        flowAnim.resetFlowAnimation();
        setFeedbackMessage('');
      }

      const currentTile = board[row]?.[col];
      if (!currentTile || !isRotatableTile(currentTile.type, currentTile.locked)) {
        return;
      }

      actionsLogRef.current.push({ row, col });

      setBoard((prev) => {
        const target = prev[row]?.[col];
        if (!target || !isRotatableTile(target.type, target.locked)) {
          return prev;
        }
        const nextRotation = rotateClockwise(target.rotation);
        const nextGrid = prev.map((rTiles, rIdx) =>
          rIdx !== row
            ? rTiles
            : rTiles.map((tile, cIdx) =>
                cIdx !== col
                  ? tile
                  : {
                      ...tile,
                      rotation: nextRotation,
                      visualRotation: tile.visualRotation + 90,
                    },
              ),
        );

        setActiveHint((prevHint) => {
          if (!prevHint) return null;
          if (prevHint.row === row && prevHint.col === col) {
            const remaining = prevHint.rotationsNeeded - 1;
            return remaining > 0 ? { ...prevHint, rotationsNeeded: remaining } : null;
          }
          return prevHint;
        });

        return nextGrid;
      });

      setRotations((prev) => prev + 1);
      setLastRotatedKey(tileKey(row, col));
      setLastRotatedSeq((prev) => prev + 1);
      soundEngine.playRotate(settings.soundEnabled);
    },
    [board, flowAnim, hasVictory, isPaused, settings.soundEnabled],
  );

  const handleRequestHint = useCallback(() => {
    if (
      isPaused ||
      hasVictory ||
      flowAnim.phase === 'flowing' ||
      flowAnim.phase === 'victory'
    ) {
      return;
    }
    const suggestion = getNextHint(level, board);
    if (!suggestion) {
      setFeedbackMessage('مسیر کامل است! دکمه «جریان آب» را فشار دهید.');
      return;
    }
    setActiveHint(suggestion);
    setHintsUsed((prev) => prev + 1);
    setFeedbackMessage(
      `کاشی ردیف ${toPersianDigits(suggestion.row + 1)}، ستون ${toPersianDigits(
        suggestion.col + 1,
      )} را ${toPersianDigits(suggestion.rotationsNeeded)} بار بچرخانید.`,
    );
    soundEngine.playHint(settings.soundEnabled);
  }, [board, flowAnim.phase, hasVictory, isPaused, level, settings.soundEnabled]);

  const handleFlowWater = useCallback(() => {
    if (
      isPaused ||
      hasVictory ||
      flowAnim.phase === 'flowing' ||
      flowAnim.phase === 'victory'
    ) {
      return;
    }

    setActiveHint(null);
    setFeedbackMessage('در حال آزمایش جریان آب در قنات...');
    soundEngine.playFlowStart(settings.soundEnabled);

    const simResult: SimulationResult = simulateWaterFlow(board);
    const destKeySet = new Set(
      level.destinations.map((pos) => tileKey(pos.row, pos.col)),
    );

    flowAnim.startFlowAnimation(simResult, {
      animationsEnabled: effectiveAnimationsEnabled,
      onStep: (step, sim) => {
        if (step > 0) {
          const hitDest = sim.orderedSteps.some(
            (s) => s.step === step && destKeySet.has(tileKey(s.row, s.col)),
          );
          if (hitDest) {
            soundEngine.playDestinationReached(settings.soundEnabled);
          } else {
            soundEngine.playFlowStep(settings.soundEnabled, step - 1);
          }
        }
      },
      onComplete: (finalSim) => {
        if (finalSim.isValidSolution) {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            setFeedbackMessage('آب با موفقیت به مظهر قنات رسید!');
            soundEngine.playVictory(settings.soundEnabled);

            if (isChallengeMode) {
              const dailyComputed = calculateDailyScore({
                completed: true,
                rotations,
                expectedMinMoves: level.expectedMinMoves,
                elapsedSeconds,
                parTimeSec: level.parTimeSec,
                hintsUsed,
                restarts: restartsCount,
              });
              const outcome = onChallengeComplete?.(dailyComputed) ?? { isNewBest: true };
              void triggerServerVerification();

              if (effectiveAnimationsEnabled) {
                victoryDelayRef.current = window.setTimeout(() => {
                  setChallengeOutcome(outcome);
                  setChallengeVictoryScore(dailyComputed);
                  soundEngine.playStarCascade(settings.soundEnabled, dailyComputed.stars);
                }, 520);
              } else {
                setChallengeOutcome(outcome);
                setChallengeVictoryScore(dailyComputed);
              }
            } else {
              const computed = calculateLevelScore({
                rotations,
                expectedMinMoves: level.expectedMinMoves,
                elapsedSeconds,
                parTimeSec: level.parTimeSec,
                hintsUsed,
              });
              const isNewBest = previousBestScore > 0 && computed.score > previousBestScore;
              const milestone = onLevelComplete(level.id, computed);

              if (effectiveAnimationsEnabled) {
                victoryDelayRef.current = window.setTimeout(() => {
                  setCampaignIsNewBest(isNewBest);
                  setVictoryMilestone(milestone);
                  setVictoryScore(computed);
                  soundEngine.playStarCascade(settings.soundEnabled, computed.stars);
                }, 520);
              } else {
                setCampaignIsNewBest(isNewBest);
                setVictoryMilestone(milestone);
                setVictoryScore(computed);
              }
            }
          }
        } else {
          soundEngine.playLeak(settings.soundEnabled);
          if (finalSim.leaks.length > 0 && !finalSim.allDestinationsReached) {
            setFeedbackMessage(
              `${toPersianDigits(finalSim.leaks.length)} نشت آب در مسیر دیده شد و آب به مقصد نرسید.`,
            );
          } else if (finalSim.leaks.length > 0) {
            setFeedbackMessage(
              `آب به مقصد رسید اما ${toPersianDigits(finalSim.leaks.length)} نشت باز در مسیر باقی مانده است.`,
            );
          } else {
            setFeedbackMessage('مسیر آب قطع است و به تمام مقصدها نرسید.');
          }
        }
      },
    });
  }, [
    board,
    effectiveAnimationsEnabled,
    elapsedSeconds,
    flowAnim,
    hasVictory,
    hintsUsed,
    isChallengeMode,
    isPaused,
    level.destinations,
    level.expectedMinMoves,
    level.id,
    level.parTimeSec,
    onChallengeComplete,
    onLevelComplete,
    previousBestScore,
    restartsCount,
    rotations,
    settings.soundEnabled,
    triggerServerVerification,
  ]);

  const isFlowing = flowAnim.phase === 'flowing';
  const showFailedState = flowAnim.phase === 'failed';

  const modeBadgeLabel =
    mode === 'daily'
      ? 'چالش روزانه'
      : mode === 'friend'
        ? 'رقابت دوستانه'
        : `مرحله ${toPersianDigits(level.id)}`;

  const modeBadgeColor =
    mode === 'daily'
      ? '#5BE8F5'
      : mode === 'friend'
        ? '#F2BE4E'
        : region.theme.accentHex;

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-[#111922] via-[#15120F] to-[#120E0B] text-[#F5ECD7] flex flex-col justify-between overflow-x-hidden">
      {/* Unified Compact Top Game HUD Dock */}
      <header className="w-full bg-[#17130F]/95 border-b border-[#463524] shrink-0">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2">
          {/* Right side (RTL start): Pause & Level/Challenge Title */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playButtonClick(settings.soundEnabled);
                onSetPaused(true);
              }}
              aria-label="توقف و منو"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-[#251D15] hover:bg-[#33271D] border border-[#614A34] flex items-center justify-center text-[#F2C96B] transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B]"
            >
              <Pause className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#FBF4E4] truncate">
                <span
                  data-testid="hud-mode-label"
                  className="shrink-0 tabular-nums"
                  style={{ color: modeBadgeColor }}
                >
                  {modeBadgeLabel}
                </span>
                <span aria-hidden="true" className="text-[#786045]">
                  ·
                </span>
                <span className="truncate">{level.titleFa}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#C6B190] truncate">
                {(() => {
                  if (isChallengeMode) {
                    return `${challengeSubtitleFa ?? DIFFICULTY_LABELS_FA[level.difficulty]} · حداقل ${toPersianDigits(level.expectedMinMoves)} حرکت`;
                  }
                  const destName = getDestinationForLevelId(level.id).nameFa;
                  const locLabel =
                    destName === region.nameFa
                      ? `مسیر ${region.nameFa}`
                      : `${destName} · مسیر ${region.nameFa}`;
                  return `${locLabel} · ${DIFFICULTY_LABELS_FA[level.difficulty]} · حداقل ${toPersianDigits(level.expectedMinMoves)} حرکت`;
                })()}
              </p>
            </div>
          </div>

          {/* Left side (RTL end): Tabular HUD Counters */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0 tabular-nums">
            <div className="text-center">
              <span className="block text-[10px] text-[#B8A280]">چرخش</span>
              <span
                data-testid="hud-moves"
                className="block text-sm sm:text-base font-bold text-[#FBF4E4] leading-tight"
              >
                {toPersianDigits(rotations)}
              </span>
            </div>

            <div className="text-center">
              <span className="block text-[10px] text-[#B8A280]">زمان</span>
              <span
                dir="ltr"
                data-testid="hud-time"
                className="block text-sm sm:text-base font-bold text-[#6CECF5] leading-tight tracking-normal"
              >
                {formatTimePersian(elapsedSeconds)}
              </span>
            </div>

            <div className="text-center">
              <span className="block text-[10px] text-[#B8A280]">راهنما</span>
              <span
                data-testid="hud-hints"
                className="block text-sm sm:text-base font-bold text-[#F2C96B] leading-tight"
              >
                {toPersianDigits(hintsUsed)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Center Playfield: Status Strip + SVG Board */}
      <main className="flex-1 flex flex-col items-center justify-center px-2.5 sm:px-3 py-2 sm:py-3 w-full max-w-3xl mx-auto">
        <div
          role="status"
          aria-live="polite"
          data-testid="game-feedback"
          className="min-h-[30px] mb-2 px-3 flex items-center justify-center gap-2 text-center text-xs sm:text-sm"
        >
          {showFailedState && (
            <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0" aria-hidden="true" />
          )}
          {hasVictory && (
            <CheckCircle2 className="w-4 h-4 text-[#7DF8C4] shrink-0" aria-hidden="true" />
          )}
          {isFlowing && (
            <Droplets className="w-4 h-4 text-[#6CECF5] shrink-0" aria-hidden="true" />
          )}
          <span
            className={
              showFailedState
                ? 'text-[#FCA5A5] font-medium'
                : hasVictory
                  ? 'text-[#7DF8C4] font-semibold'
                  : isFlowing
                    ? 'text-[#6CECF5] font-medium'
                    : 'text-[#D4C09E]'
            }
          >
            {feedbackMessage || level.subtitleFa}
          </span>
        </div>

        <GameBoard
          grid={board}
          rows={level.rows}
          cols={level.cols}
          simulation={flowAnim.simulation}
          visibleStep={flowAnim.visibleStep}
          lastRotatedKey={lastRotatedKey}
          lastRotatedSeq={lastRotatedSeq}
          accentHex={modeBadgeColor}
          showDisconnected={showFailedState}
          showLeakHints={settings.showLeakHints}
          activeHint={activeHint}
          animationsEnabled={effectiveAnimationsEnabled}
          disabled={isPaused || isFlowing || hasVictory}
          onRotateTile={handleRotateTile}
        />
      </main>

      {/* Bottom Ergonomic Thumb-Zone Action Dock */}
      <footer className="w-full bg-[#17130F]/95 border-t border-[#463524] shrink-0">
        <div className="max-w-xl mx-auto px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2.5">
          <button
            type="button"
            data-testid="btn-flow-water"
            disabled={isFlowing || hasVictory}
            onClick={handleFlowWater}
            className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-[#108E9E] hover:bg-[#14A6B8] disabled:opacity-60 active:scale-[0.98] text-[#F4FEFF] border border-[#5BE8F5]/45 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_8px_22px_rgba(16,142,158,0.34),inset_0_1px_0_rgba(182,250,255,0.28)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8DF6FF] whitespace-nowrap"
          >
            <Droplets className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{isFlowing ? 'در حال جریان...' : 'جریان آب'}</span>
          </button>

          <button
            type="button"
            data-testid="btn-hint"
            disabled={isFlowing || hasVictory}
            onClick={handleRequestHint}
            className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#251D15] hover:bg-[#33271D] disabled:opacity-50 border border-[#72573A] text-[#F2CA70] font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B] whitespace-nowrap shrink-0"
          >
            <Lightbulb className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>راهنما</span>
          </button>

          <button
            type="button"
            data-testid="btn-restart"
            onClick={() => handleRestart()}
            aria-label="شروع مجدد مرحله"
            className="min-h-[48px] px-3.5 py-2.5 rounded-xl bg-[#251D15] hover:bg-[#33271D] border border-[#5B4631] text-[#E6D5B8] font-medium text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B] whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">شروع مجدد</span>
          </button>
        </div>
      </footer>

      {/* Pause Modal */}
      {isPaused && !hasVictory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-modal-title"
          className="fixed inset-0 z-50 bg-[#090C10]/80 flex items-center justify-center p-4"
        >
          <div
            className={`w-full max-w-sm rounded-2xl bg-[#1A1511] border border-[#765A3C] p-6 shadow-2xl ${
              effectiveAnimationsEnabled ? 'animate-qanat-modal' : ''
            }`}
          >
            <h2
              id="pause-modal-title"
              className="font-display text-3xl text-center text-[#FBF4E4]"
            >
              توقف بازی
            </h2>
            <p className="mt-1 text-center text-sm text-[#CBB896]">
              {isChallengeMode
                ? `${modeBadgeLabel} · ${level.titleFa}`
                : `${region.nameFa} · مرحله ${toPersianDigits(level.id)} (${level.titleFa})`}
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playButtonClick(settings.soundEnabled);
                  onSetPaused(false);
                }}
                className="w-full min-h-[48px] rounded-xl bg-[#D99B26] hover:bg-[#E7AC3B] text-[#17110A] font-bold text-base flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4]"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>ادامه بازی</span>
              </button>

              <button
                type="button"
                data-testid="pause-sound-toggle"
                aria-pressed={settings.soundEnabled}
                onClick={() => {
                  const willEnable = !settings.soundEnabled;
                  onToggleSound();
                  if (willEnable) {
                    soundEngine.playButtonClick(true);
                  }
                }}
                className="w-full min-h-[46px] rounded-xl bg-[#251D15] hover:bg-[#32271D] border border-[#5C4732] text-[#F5ECD7] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B]"
              >
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#5BE8F5]" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#A48F73]" aria-hidden="true" />
                )}
                <span>جلوه‌های صوتی: {settings.soundEnabled ? 'روشن' : 'خاموش'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleRestart()}
                className="w-full min-h-[46px] rounded-xl bg-[#251D15] hover:bg-[#32271D] border border-[#5C4732] text-[#F5ECD7] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B]"
              >
                <RotateCcw className="w-4 h-4 text-[#E6BA5E]" aria-hidden="true" />
                <span>شروع مجدد</span>
              </button>

              {isChallengeMode && onReturnToModeHub ? (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playButtonClick(settings.soundEnabled);
                    onSetPaused(false);
                    onReturnToModeHub();
                  }}
                  className="w-full min-h-[46px] rounded-xl bg-[#251D15] hover:bg-[#32271D] border border-[#5C4732] text-[#F5ECD7] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B]"
                >
                  {mode === 'daily' ? (
                    <Calendar className="w-4 h-4 text-[#5BE8F5]" aria-hidden="true" />
                  ) : (
                    <Users className="w-4 h-4 text-[#5BE8F5]" aria-hidden="true" />
                  )}
                  <span>{mode === 'daily' ? 'بازگشت به چالش روزانه' : 'بازگشت به رقابت با دوستان'}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playButtonClick(settings.soundEnabled);
                      onSetPaused(false);
                      onOpenMap();
                    }}
                    className="w-full min-h-[46px] rounded-xl bg-[#251D15] hover:bg-[#32271D] border border-[#5C4732] text-[#F5ECD7] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B]"
                  >
                    <Map className="w-4 h-4 text-[#5BE8F5]" aria-hidden="true" />
                    <span>نقشه مناطق</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playButtonClick(settings.soundEnabled);
                      onSetPaused(false);
                      onOpenLevels();
                    }}
                    className="w-full min-h-[46px] rounded-xl bg-[#251D15] hover:bg-[#32271D] border border-[#5C4732] text-[#F5ECD7] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B]"
                  >
                    <Grid2X2 className="w-4 h-4 text-[#E6BA5E]" aria-hidden="true" />
                    <span>انتخاب مرحله</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  soundEngine.playButtonClick(settings.soundEnabled);
                  onSetPaused(false);
                  onGoHome();
                }}
                className="w-full min-h-[44px] rounded-xl text-[#CBB896] hover:text-[#FBF4E4] text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B]"
              >
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                <span>بازگشت به صفحه اصلی</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Victory Modal (Preserved scoring & progression, enhanced visual celebration) */}
      {victoryScore && !isChallengeMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="victory-modal-title"
          data-testid="victory-modal"
          className="fixed inset-0 z-50 bg-[#080F16]/84 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            className={`relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#132934] via-[#152126] to-[#171B1E] border border-[#26B8C9]/80 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.72)] text-center ${
              effectiveAnimationsEnabled ? 'animate-qanat-modal' : ''
            }`}
          >
            <VictoryCelebrationOrnament animationsEnabled={effectiveAnimationsEnabled} />

            <h2
              id="victory-modal-title"
              className="font-display text-3xl text-[#FBF4E4]"
            >
              قنات جاری شد!
            </h2>
            <p className="mt-1 text-sm text-[#A5EDF5]">
              {getDestinationForLevelId(level.id).nameFa} · مرحله {toPersianDigits(level.id)} ({level.titleFa})
            </p>

            {/* Animated Three-Star Display */}
            <div className="mt-4">
              <AnimatedStarRow
                stars={victoryScore.stars}
                animationsEnabled={effectiveAnimationsEnabled}
                size="lg"
              />
            </div>

            {campaignIsNewBest && (
              <p className="mt-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#7DF8C4]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>رکورد شخصی جدید در این مرحله!</span>
              </p>
            )}

            {/* Narrative Milestone Callout */}
            {victoryMilestone && (
              <div
                data-testid="victory-milestone"
                className="mt-4 rounded-xl bg-[#112A33] border border-[#2AB3C4]/60 p-3 text-right"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2C96B]">
                  <Compass className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{victoryMilestone.titleFa}</span>
                </div>
                <p className="mt-1 text-xs text-[#D1F2F5] leading-relaxed">
                  {victoryMilestone.bodyFa}
                </p>
              </div>
            )}

            {/* Score & Mastery Metrics */}
            <div className="mt-4 py-3.5 border-y border-[#2B434B] grid grid-cols-3 gap-2 tabular-nums">
              <div>
                <span className="block text-[11px] text-[#9BBAC2]">امتیاز کمپین</span>
                <AnimatedScoreCounter
                  value={victoryScore.score}
                  animationsEnabled={effectiveAnimationsEnabled}
                  testId="victory-score"
                  className="block text-lg font-bold text-[#F2C96B] mt-0.5"
                />
              </div>
              <div>
                <span className="block text-[11px] text-[#9BBAC2]">چرخش‌ها</span>
                <span className="block text-lg font-bold text-[#FBF4E4] mt-0.5">
                  {toPersianDigits(victoryScore.rotations)}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-[#9BBAC2]">زمان</span>
                <span
                  dir="ltr"
                  className="block text-lg font-bold text-[#6CECF5] mt-0.5"
                >
                  {formatTimePersian(victoryScore.elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-2.5">
              {victoryMilestone?.kind === 'region_unlocked' ||
              victoryMilestone?.kind === 'campaign_complete' ? (
                <button
                  type="button"
                  data-start="true"
                  onClick={() => {
                    soundEngine.playButtonClick(settings.soundEnabled);
                    onOpenMap();
                  }}
                  className="w-full min-h-[48px] rounded-xl bg-[#D99B26] hover:bg-[#E7AC3B] text-[#17110A] font-bold text-base flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4]"
                >
                  <Map className="w-4 h-4" aria-hidden="true" />
                  <span>{victoryMilestone.ctaFa}</span>
                </button>
              ) : hasNextLevel ? (
                <button
                  type="button"
                  data-start="true"
                  onClick={() => {
                    soundEngine.playButtonClick(settings.soundEnabled);
                    onNextLevel();
                  }}
                  className="w-full min-h-[48px] rounded-xl bg-[#D99B26] hover:bg-[#E7AC3B] text-[#17110A] font-bold text-base flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4]"
                >
                  <span>مرحله بعدی</span>
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  data-start="true"
                  onClick={() => {
                    soundEngine.playButtonClick(settings.soundEnabled);
                    onOpenMap();
                  }}
                  className="w-full min-h-[48px] rounded-xl bg-[#D99B26] hover:bg-[#E7AC3B] text-[#17110A] font-bold text-base flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4]"
                >
                  <Map className="w-4 h-4" aria-hidden="true" />
                  <span>نقشه مناطق ایران</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleRestart({ freshReplay: true })}
                  className="min-h-[44px] rounded-xl bg-[#213137] hover:bg-[#2B3F46] border border-[#3B555F] text-[#EBF9FA] font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5]"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>تکرار</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playButtonClick(settings.soundEnabled);
                    onOpenLevels();
                  }}
                  className="min-h-[44px] rounded-xl bg-[#213137] hover:bg-[#2B3F46] border border-[#3B555F] text-[#EBF9FA] font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5]"
                >
                  <Grid2X2 className="w-4 h-4" aria-hidden="true" />
                  <span>مراحل</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily / Friend Challenge Victory Modal (Local vs Server-Verified Ranked v2 kept strictly distinct) */}
      {challengeVictoryScore && isChallengeMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="challenge-victory-title"
          data-testid="challenge-victory-modal"
          className="fixed inset-0 z-50 bg-[#080F16]/84 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            className={`relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#132934] via-[#152126] to-[#171B1E] border border-[#26B8C9]/80 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.72)] text-center ${
              effectiveAnimationsEnabled ? 'animate-qanat-modal' : ''
            }`}
          >
            <VictoryCelebrationOrnament animationsEnabled={effectiveAnimationsEnabled} />

            <span className="text-xs font-semibold text-[#7DF8C4]">
              {mode === 'daily' ? 'امتیاز محلی چالش روزانه' : 'امتیاز محلی رقابت دوستانه'}
            </span>
            <h2
              id="challenge-victory-title"
              data-testid="challenge-victory-performance"
              className="font-display text-3xl text-[#FBF4E4] mt-1"
            >
              {challengeVictoryScore.performanceLabelFa}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#A5EDF5]">
              {level.titleFa}
              {challengeCode ? (
                <>
                  {' · '}
                  <span dir="ltr" className="inline-block font-mono">
                    {challengeCode}
                  </span>
                </>
              ) : null}
            </p>

            {/* Animated Stars */}
            <div className="mt-3.5">
              <AnimatedStarRow
                stars={challengeVictoryScore.stars}
                animationsEnabled={effectiveAnimationsEnabled}
                size="md"
              />
            </div>

            {/* Record Preservation & Streak Feedback */}
            <div className="mt-3 text-xs text-[#D1F2F5] flex flex-col gap-1">
              <span
                data-testid="challenge-record-status"
                className={challengeOutcome?.isNewBest ? 'text-[#7DF8C4] font-semibold' : ''}
              >
                {challengeOutcome?.isNewBest
                  ? 'رکورد جدید شما در این چالش ثبت شد!'
                  : 'رکورد بهتر قبلی شما همچنان حفظ شد.'}
              </span>
              {mode === 'daily' && typeof challengeOutcome?.currentStreak === 'number' && (
                <span
                  data-testid="challenge-victory-streak"
                  className="inline-flex items-center justify-center gap-1 text-[#F2C96B] font-semibold tabular-nums"
                >
                  <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>زنجیره روزانه: {toPersianDigits(challengeOutcome.currentStreak)} روز</span>
                </span>
              )}
            </div>

            {/* Detailed Local Metrics */}
            <div className="mt-4 py-3 border-y border-[#2B434B] grid grid-cols-3 gap-2 tabular-nums">
              <div>
                <span className="block text-[11px] text-[#9BBAC2]">امتیاز محلی</span>
                <AnimatedScoreCounter
                  value={challengeVictoryScore.score}
                  animationsEnabled={effectiveAnimationsEnabled}
                  testId="challenge-victory-score"
                  className="block text-lg font-bold text-[#F2C96B] mt-0.5"
                />
              </div>
              <div>
                <span className="block text-[11px] text-[#9BBAC2]">چرخش‌ها</span>
                <span className="block text-lg font-bold text-[#FBF4E4] mt-0.5">
                  {toPersianDigits(challengeVictoryScore.rotations)}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-[#9BBAC2]">زمان</span>
                <span
                  dir="ltr"
                  className="block text-lg font-bold text-[#6CECF5] mt-0.5"
                >
                  {formatTimePersian(challengeVictoryScore.elapsedSeconds)}
                </span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-[#9BBAC2] tabular-nums">
              <span>راهنما: {toPersianDigits(challengeVictoryScore.hintsUsed)}</span>
              <span aria-hidden="true">·</span>
              <span>شروع مجدد: {toPersianDigits(challengeVictoryScore.restarts)}</span>
            </div>

            {/* Server-Side Action Verification Status (strictly distinct from local offline score) */}
            {challengeMeta && (
              <div
                data-testid="server-verification-status"
                className="mt-3 rounded-xl bg-[#102229] border border-[#245C68] p-3 text-right text-xs leading-relaxed"
              >
                {serverVerifyLoading ? (
                  <p className="text-[#9FDCE5]">در حال تأیید مسیر حل در سرور لبه...</p>
                ) : serverVerifyResult?.status === 'verified' ? (
                  <div className="tabular-nums">
                    <p className="font-semibold text-[#7DF8C4] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>
                        تأیید شده توسط سرور لبه (نسخه رتبه‌بندی{' '}
                        {toPersianDigits(serverVerifyResult.data.scoringVersion)})
                      </span>
                    </p>
                    <p className="text-[#CBEFF2] mt-1">
                      امتیاز تأییدشده سرور:{' '}
                      <span
                        data-testid="server-verified-score"
                        className="font-bold text-[#F2C96B]"
                      >
                        {toPersianDigits(serverVerifyResult.data.rankedScore.score)}
                      </span>{' '}
                      · حرکت تأییدشده:{' '}
                      {toPersianDigits(serverVerifyResult.data.verifiedMoves)}
                    </p>
                  </div>
                ) : serverVerifyResult?.status === 'offline' ? (
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[#E6BA5E] flex items-center gap-1.5">
                      <ShieldOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{serverVerifyResult.messageFa}</span>
                    </span>
                    <button
                      type="button"
                      data-testid="btn-retry-server-verify"
                      onClick={() => void triggerServerVerification()}
                      className="min-h-[36px] px-3 rounded-lg bg-[#213137] hover:bg-[#2C4047] text-[#E6FAFC] text-[11px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5]"
                    >
                      تلاش مجدد
                    </button>
                  </div>
                ) : serverVerifyResult?.status === 'rejected' ? (
                  <p className="text-[#FCA5A5] flex items-center gap-1.5">
                    <ShieldOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{serverVerifyResult.messageFa}</span>
                  </p>
                ) : null}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-2.5">
              {onReturnToModeHub && (
                <button
                  type="button"
                  data-testid="btn-victory-return-hub"
                  onClick={() => {
                    soundEngine.playButtonClick(settings.soundEnabled);
                    onReturnToModeHub();
                  }}
                  className="w-full min-h-[48px] rounded-xl bg-[#D99B26] hover:bg-[#E7AC3B] text-[#17110A] font-bold text-base flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4]"
                >
                  <span>
                    {mode === 'daily' ? 'بازگشت به چالش روزانه' : 'بازگشت به رقابت با دوستان'}
                  </span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  data-testid="btn-victory-replay"
                  onClick={() => handleRestart({ freshReplay: true })}
                  className="min-h-[44px] rounded-xl bg-[#213137] hover:bg-[#2B3F46] border border-[#3B555F] text-[#EBF9FA] font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5]"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>تکرار</span>
                </button>

                {onShareChallenge ? (
                  <button
                    type="button"
                    data-testid="btn-victory-share"
                    onClick={() => {
                      soundEngine.playButtonClick(settings.soundEnabled);
                      onShareChallenge();
                    }}
                    className="min-h-[44px] rounded-xl bg-[#133A46] hover:bg-[#194C5B] border border-[#288B9A] text-[#E6FAFC] font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5]"
                  >
                    <Share2 className="w-4 h-4 text-[#5BE8F5]" aria-hidden="true" />
                    <span>ارسال به دوست</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playButtonClick(settings.soundEnabled);
                      onGoHome();
                    }}
                    className="min-h-[44px] rounded-xl bg-[#213137] hover:bg-[#2B3F46] border border-[#3B555F] text-[#EBF9FA] font-semibold text-sm flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5]"
                  >
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    <span>خانه</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

