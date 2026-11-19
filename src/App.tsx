import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { soundEngine } from './audio/soundEffects';
import {
  detectCompletionMilestone,
  getRecommendedPlayableLevelId,
  isLevelUnlocked,
} from './campaign/progression';
import { getRegionForLevelId, STORY_MOMENTS } from './campaign/regions';
import {
  resolveEffectiveAnimationsEnabled,
  usePrefersReducedMotion,
} from './hooks/usePrefersReducedMotion';
import { generateDailyChallenge } from './engagement/dailyChallenge';
import {
  createFriendChallengeFromTemplate,
  parseFriendChallengeFromSearch,
} from './engagement/friendChallenge';
import { getTehranDateKey } from './engagement/tehranTime';
import type {
  AppScreen,
  DailyScoreResult,
  FriendChallengeDefinition,
  GameMode,
  GameSettings,
  RegionId,
  SavedEngagementData,
  SavedProgress,
  ScoreResult,
  StoryMoment,
} from './engine/types';
import { getLevelById, LEVELS } from './levels/levels';
import {
  clearEngagementData,
  loadEngagementData,
  recordDailyChallengeCompletion,
  recordFriendChallengeCompletion,
} from './storage/engagementStorage';
import {
  clearProgress,
  loadProgress,
  loadSettings,
  markStorySeen,
  recordLevelCompletion,
  saveSettings,
  updateLastPlayedLevel,
} from './storage/progressStorage';
import type { ChallengeCompletionOutcome } from './components/GameScreen';
import { HomeScreen } from './components/HomeScreen';
import { StoryCelebrationModal } from './components/StoryCelebrationModal';

const DailyChallengeScreen = lazy(() =>
  import('./components/DailyChallengeScreen').then((m) => ({ default: m.DailyChallengeScreen })),
);
const FriendChallengeScreen = lazy(() =>
  import('./components/FriendChallengeScreen').then((m) => ({ default: m.FriendChallengeScreen })),
);
const GameScreen = lazy(() =>
  import('./components/GameScreen').then((m) => ({ default: m.GameScreen })),
);
const LevelSelectScreen = lazy(() =>
  import('./components/LevelSelectScreen').then((m) => ({ default: m.LevelSelectScreen })),
);
const RegionalMapScreen = lazy(() =>
  import('./components/RegionalMapScreen').then((m) => ({ default: m.RegionalMapScreen })),
);
const SettingsScreen = lazy(() =>
  import('./components/SettingsScreen').then((m) => ({ default: m.SettingsScreen })),
);
const StatisticsScreen = lazy(() =>
  import('./components/StatisticsScreen').then((m) => ({ default: m.StatisticsScreen })),
);

function ScreenLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-dvh w-full bg-[#14110E] text-[#D7C6AA] flex items-center justify-center p-6"
    >
      <div className="rounded-2xl bg-[#1D1712] border border-[#3E3022] px-6 py-4 text-sm font-medium">
        در حال آماده‌سازی قنات...
      </div>
    </div>
  );
}

function clearChallengeQueryParam(): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('challenge')) {
      url.searchParams.delete('challenge');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
  } catch {
    // Ignore history API restrictions
  }
}

interface InitialBootState {
  screen: AppScreen;
  friendChallenge: FriendChallengeDefinition;
  friendFromLink: boolean;
  friendImportError: string | null;
}

function resolveInitialBootState(todayTehranKey: string): InitialBootState {
  const daily = generateDailyChallenge(todayTehranKey);
  const defaultFriend = createFriendChallengeFromTemplate(daily.templateId, daily.seed);

  if (typeof window !== 'undefined') {
    const parsedChallenge = parseFriendChallengeFromSearch(window.location.search);
    if (parsedChallenge !== null) {
      if (parsedChallenge.ok) {
        return {
          screen: 'friend',
          friendChallenge: parsedChallenge.challenge,
          friendFromLink: true,
          friendImportError: null,
        };
      }
      return {
        screen: 'friend',
        friendChallenge: defaultFriend,
        friendFromLink: false,
        friendImportError: parsedChallenge.messageFa,
      };
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return {
        screen: 'playing',
        friendChallenge: defaultFriend,
        friendFromLink: false,
        friendImportError: null,
      };
    }
  }

  return {
    screen: 'home',
    friendChallenge: defaultFriend,
    friendFromLink: false,
    friendImportError: null,
  };
}

export default function App() {
  const [todayTehranKey, setTodayTehranKey] = useState<string>(() => getTehranDateKey());
  const [bootState] = useState<InitialBootState>(() => resolveInitialBootState(getTehranDateKey()));

  const [progress, setProgress] = useState<SavedProgress>(() => loadProgress());
  const [engagement, setEngagement] = useState<SavedEngagementData>(() => loadEngagementData());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());

  const [screen, setScreen] = useState<AppScreen>(bootState.screen);
  const [gameMode, setGameMode] = useState<GameMode>('campaign');
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>(
    () => loadProgress().lastSelectedRegionId,
  );
  const [activeLevelId, setActiveLevelId] = useState<number>(() =>
    getRecommendedPlayableLevelId(loadProgress()),
  );
  const [activeFriendChallenge, setActiveFriendChallenge] = useState<FriendChallengeDefinition>(
    bootState.friendChallenge,
  );
  const [friendFromLink, setFriendFromLink] = useState<boolean>(bootState.friendFromLink);
  const [friendImportError, setFriendImportError] = useState<string | null>(
    bootState.friendImportError,
  );

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeStoryMoment, setActiveStoryMoment] = useState<StoryMoment | null>(null);
  const systemPrefersReducedMotion = usePrefersReducedMotion();
  const effectiveAnimationsEnabled = resolveEffectiveAnimationsEnabled(
    settings.animationsEnabled,
    systemPrefersReducedMotion,
  );

  // Clean up any scheduled audio timers on app unmount
  useEffect(() => {
    return () => {
      soundEngine.dispose();
    };
  }, []);

  // Keep Tehran date boundary synced if the tab stays open across 00:00 Asia/Tehran
  useEffect(() => {
    const timer = window.setInterval(() => {
      const latestKey = getTehranDateKey();
      setTodayTehranKey((prev) => (prev === latestKey ? prev : latestKey));
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const dailyChallenge = useMemo(
    () => generateDailyChallenge(todayTehranKey),
    [todayTehranKey],
  );

  // Sync game shell state to document.body.dataset.state & reduced-motion class
  useEffect(() => {
    const stateAttr =
      screen === 'playing' ? (isPaused ? 'paused' : 'playing') : 'title';
    document.body.dataset.state = stateAttr;
    document.body.classList.toggle('reduced-motion', !effectiveAnimationsEnabled);
  }, [screen, isPaused, effectiveAnimationsEnabled]);

  // Reset scroll position on screen or region navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, selectedRegionId]);

  const startLevel = useCallback(
    (levelId: number, options?: { showIntroStory?: boolean }) => {
      const clamped = Math.min(Math.max(1, levelId), LEVELS.length);
      if (!isLevelUnlocked(progress, clamped)) {
        return;
      }
      const levelRegion = getRegionForLevelId(clamped).id;
      setGameMode('campaign');
      setActiveLevelId(clamped);
      setSelectedRegionId(levelRegion);
      setIsPaused(false);
      setProgress((prev) => updateLastPlayedLevel(prev, clamped));
      setScreen('playing');

      if (
        options?.showIntroStory &&
        clamped === 1 &&
        !progress.seenStoryIds.includes('enter_yazd')
      ) {
        setActiveStoryMoment(STORY_MOMENTS.enter_yazd);
      }

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    },
    [progress],
  );

  const handleStartAdventure = useCallback(() => {
    const targetLevel = getRecommendedPlayableLevelId(progress);
    startLevel(targetLevel, { showIntroStory: targetLevel === 1 });
  }, [progress, startLevel]);

  const handleContinueGame = useCallback(() => {
    const targetLevel = getRecommendedPlayableLevelId(progress);
    startLevel(targetLevel);
  }, [progress, startLevel]);

  const handleStartDailyChallenge = useCallback(() => {
    setGameMode('daily');
    setIsPaused(false);
    setScreen('playing');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const handlePlayFriendChallenge = useCallback((challenge: FriendChallengeDefinition) => {
    setActiveFriendChallenge(challenge);
    setGameMode('friend');
    setIsPaused(false);
    setScreen('playing');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const handleShareDailyAsFriend = useCallback(() => {
    const friendFromDaily = createFriendChallengeFromTemplate(
      dailyChallenge.templateId,
      dailyChallenge.seed,
    );
    setActiveFriendChallenge(friendFromDaily);
    setFriendFromLink(false);
    setFriendImportError(null);
    setIsPaused(false);
    setScreen('friend');
  }, [dailyChallenge.seed, dailyChallenge.templateId]);

  const handleSelectRegion = useCallback(
    (regionId: RegionId) => {
      setSelectedRegionId(regionId);
      setScreen('levels');
    },
    [],
  );

  const handleLevelComplete = useCallback(
    (levelId: number, result: ScoreResult): StoryMoment | null => {
      const nextId = levelId < LEVELS.length ? levelId + 1 : levelId;
      const updated = recordLevelCompletion(progress, levelId, result, nextId);
      const detected = detectCompletionMilestone(progress, updated, levelId);
      if (detected && !progress.seenStoryIds.includes(detected.id)) {
        const marked = markStorySeen(updated, detected.id);
        setProgress(marked);
        return detected;
      }
      setProgress(updated);
      return null;
    },
    [progress],
  );

  const handleChallengeComplete = useCallback(
    (result: DailyScoreResult): ChallengeCompletionOutcome => {
      if (gameMode === 'daily') {
        const latestTodayKey = getTehranDateKey();
        const { data, isNewBest } = recordDailyChallengeCompletion(engagement, {
          dateKey: dailyChallenge.dateKey,
          todayTehranKey: latestTodayKey,
          algoVersion: dailyChallenge.algoVersion,
          result,
        });
        setEngagement(data);
        return {
          isNewBest,
          currentStreak: data.streak.currentStreak,
        };
      }

      if (gameMode === 'friend') {
        const { data, isNewBest } = recordFriendChallengeCompletion(engagement, {
          challenge: activeFriendChallenge,
          result,
        });
        setEngagement(data);
        return { isNewBest };
      }

      return { isNewBest: false };
    },
    [activeFriendChallenge, dailyChallenge.algoVersion, dailyChallenge.dateKey, engagement, gameMode],
  );

  const handleNextLevel = useCallback(() => {
    const nextId = Math.min(activeLevelId + 1, LEVELS.length);
    if (isLevelUnlocked(progress, nextId)) {
      startLevel(nextId);
    } else {
      setScreen('map');
    }
  }, [activeLevelId, progress, startLevel]);

  const handleUpdateSettings = useCallback((next: GameSettings) => {
    setSettings(next);
    saveSettings(next);
  }, []);

  const handleToggleSound = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, soundEnabled: !prev.soundEnabled };
      saveSettings(next);
      return next;
    });
  }, []);

  const handleResetProgress = useCallback(() => {
    const freshCampaign = clearProgress();
    const freshEngagement = clearEngagementData();
    setProgress(freshCampaign);
    setEngagement(freshEngagement);
    setSelectedRegionId('yazd');
    setActiveLevelId(1);
    setActiveStoryMoment(null);
  }, []);

  const handleDismissStoryMoment = useCallback(() => {
    if (activeStoryMoment) {
      setProgress((prev) => markStorySeen(prev, activeStoryMoment.id));
    }
    setActiveStoryMoment(null);
  }, [activeStoryMoment]);

  // Keyboard shortcuts: Enter/Space starts on home, Escape toggles pause in gameplay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeStoryMoment && (e.key === 'Enter' || e.key === 'Escape')) {
        e.preventDefault();
        handleDismissStoryMoment();
        return;
      }
      if (screen === 'home' && (e.key === 'Enter' || e.key === ' ')) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return;
        e.preventDefault();
        handleStartAdventure();
      } else if (screen === 'playing' && e.key === 'Escape') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeStoryMoment, handleDismissStoryMoment, handleStartAdventure, screen]);

  const currentCampaignLevel = getLevelById(activeLevelId);
  const activePlayLevel =
    gameMode === 'daily'
      ? dailyChallenge.level
      : gameMode === 'friend'
        ? activeFriendChallenge.level
        : currentCampaignLevel;

  const activeSessionKey =
    gameMode === 'daily'
      ? `daily-${dailyChallenge.challengeId}`
      : gameMode === 'friend'
        ? `friend-${activeFriendChallenge.challengeId}`
        : `campaign-${currentCampaignLevel.id}`;

  return (
    <div dir="rtl" className="min-h-dvh w-full bg-[#14110E] text-[#F5ECD7]">
      {screen === 'home' && (
        <HomeScreen
          progress={progress}
          engagement={engagement}
          todayTehranKey={todayTehranKey}
          soundEnabled={settings.soundEnabled}
          animationsEnabled={effectiveAnimationsEnabled}
          onStartAdventure={handleStartAdventure}
          onContinueGame={handleContinueGame}
          onOpenMap={() => setScreen('map')}
          onOpenLevels={() => {
            setSelectedRegionId(progress.lastSelectedRegionId);
            setScreen('levels');
          }}
          onOpenDaily={() => setScreen('daily')}
          onOpenFriend={() => setScreen('friend')}
          onOpenStats={() => setScreen('stats')}
          onOpenSettings={() => setScreen('settings')}
        />
      )}

      <Suspense fallback={<ScreenLoadingFallback />}>
      {screen === 'map' && (
        <RegionalMapScreen
          progress={progress}
          onSelectRegion={handleSelectRegion}
          onBackHome={() => setScreen('home')}
        />
      )}

      {screen === 'levels' && (
        <LevelSelectScreen
          progress={progress}
          selectedRegionId={selectedRegionId}
          onChangeRegion={handleSelectRegion}
          onSelectLevel={(id) => startLevel(id)}
          onOpenMap={() => setScreen('map')}
          onBackHome={() => setScreen('home')}
        />
      )}

      {screen === 'daily' && (
        <DailyChallengeScreen
          dailyChallenge={dailyChallenge}
          engagement={engagement}
          onStartDaily={handleStartDailyChallenge}
          onShareDailyAsFriend={handleShareDailyAsFriend}
          onBackHome={() => setScreen('home')}
        />
      )}

      {screen === 'friend' && (
        <FriendChallengeScreen
          activeChallenge={activeFriendChallenge}
          importedError={friendImportError}
          isFromLink={friendFromLink}
          engagement={engagement}
          onChangeChallenge={(challenge, fromLink) => {
            setActiveFriendChallenge(challenge);
            setFriendFromLink(fromLink);
          }}
          onClearImportError={() => {
            clearChallengeQueryParam();
            setFriendImportError(null);
          }}
          onPlayChallenge={handlePlayFriendChallenge}
          onBackHome={() => {
            clearChallengeQueryParam();
            setScreen('home');
          }}
        />
      )}

      {screen === 'stats' && (
        <StatisticsScreen
          progress={progress}
          engagement={engagement}
          todayTehranKey={todayTehranKey}
          onStartCampaign={handleStartAdventure}
          onOpenDaily={() => setScreen('daily')}
          onBackHome={() => setScreen('home')}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          settings={settings}
          systemPrefersReducedMotion={systemPrefersReducedMotion}
          onUpdateSettings={handleUpdateSettings}
          onResetProgress={handleResetProgress}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'playing' && (
        <GameScreen
          level={activePlayLevel}
          mode={gameMode}
          sessionKey={activeSessionKey}
          challengeCode={gameMode === 'friend' ? activeFriendChallenge.challengeId : undefined}
          challengeSubtitleFa={
            gameMode === 'daily'
              ? dailyChallenge.persianDateFa
              : gameMode === 'friend'
                ? activeFriendChallenge.challengeId
                : undefined
          }
          challengeMeta={
            gameMode === 'daily'
              ? {
                  challengeId: dailyChallenge.challengeId,
                  dateKey: dailyChallenge.dateKey,
                  algoVersion: dailyChallenge.algoVersion,
                }
              : gameMode === 'friend'
                ? {
                    challengeId: activeFriendChallenge.challengeId,
                    algoVersion: activeFriendChallenge.algoVersion,
                  }
                : undefined
          }
          previousBestScore={
            gameMode === 'campaign'
              ? (progress.levels[currentCampaignLevel.id]?.bestScore ?? 0)
              : 0
          }
          settings={settings}
          effectiveAnimationsEnabled={effectiveAnimationsEnabled}
          isPaused={isPaused}
          onSetPaused={setIsPaused}
          onToggleSound={handleToggleSound}
          onLevelComplete={handleLevelComplete}
          onChallengeComplete={handleChallengeComplete}
          onShareChallenge={
            gameMode === 'daily'
              ? handleShareDailyAsFriend
              : gameMode === 'friend'
                ? () => {
                    setIsPaused(false);
                    setScreen('friend');
                  }
                : undefined
          }
          onReturnToModeHub={
            gameMode === 'daily'
              ? () => {
                  setIsPaused(false);
                  setScreen('daily');
                }
              : gameMode === 'friend'
                ? () => {
                    setIsPaused(false);
                    setScreen('friend');
                  }
                : undefined
          }
          onNextLevel={handleNextLevel}
          onOpenMap={() => {
            setIsPaused(false);
            setScreen('map');
          }}
          onOpenLevels={() => {
            setIsPaused(false);
            setSelectedRegionId(currentCampaignLevel.regionId);
            setScreen('levels');
          }}
          onGoHome={() => {
            setIsPaused(false);
            setScreen('home');
          }}
        />
      )}
      </Suspense>

      {activeStoryMoment && (
        <StoryCelebrationModal
          moment={activeStoryMoment}
          animationsEnabled={effectiveAnimationsEnabled}
          onContinue={handleDismissStoryMoment}
        />
      )}
    </div>
  );
}

