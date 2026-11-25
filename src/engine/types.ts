export type Direction = 'N' | 'E' | 'S' | 'W';

export type Rotation = 0 | 90 | 180 | 270;

export type TileType =
  | 'straight'
  | 'corner'
  | 'tee'
  | 'cross'
  | 'source'
  | 'destination'
  | 'blocked'
  | 'empty';

export type RegionId =
  | 'yazd'
  | 'kerman'
  | 'kashan'
  | 'zanjan'
  | 'khorasan'
  | 'isfahan'
  | 'fars'
  | 'semnan'
  | 'northwest'
  | 'razavi_khorasan'
  | 'shahsavan'
  | 'turkmen_sahra';

export type DestinationId =
  | 'yazd'
  | 'meybod'
  | 'ardakan'
  | 'taft'
  | 'kerman'
  | 'mahan'
  | 'bam'
  | 'rayen'
  | 'kashan'
  | 'abuzeydabad'
  | 'niasar'
  | 'qamsar'
  | 'zanjan'
  | 'ijrud'
  | 'soltaniyeh'
  | 'mahneshan'
  | 'gonabad'
  | 'ferdows'
  | 'tabas'
  | 'birjand'
  | 'isfahan'
  | 'ardestan'
  | 'nain'
  | 'natanz'
  | 'shiraz'
  | 'neyriz'
  | 'estahban'
  | 'abadeh'
  | 'garmsar'
  | 'semnan'
  | 'damghan'
  | 'shahroud'
  | 'tabriz'
  | 'maragheh'
  | 'khoy'
  | 'urmia'
  | 'nishapur'
  | 'sabzevar'
  | 'kashmar'
  | 'torbat_heydarieh'
  | 'parsabad'
  | 'bileh_savar'
  | 'germi'
  | 'meshgin_shahr'
  | 'ardabil_sabalan'
  | 'gonbad_kavus'
  | 'aq_qala'
  | 'bandar_torkaman'
  | 'gomishan'
  | 'maraveh_tappeh';

export type Difficulty =
  | 'easy'
  | 'normal'
  | 'medium'
  | 'challenging'
  | 'hard'
  | 'expert';

export interface GridPosition {
  row: number;
  col: number;
}

export interface TileDefinition {
  type: TileType;
  initialRotation: Rotation;
  solutionRotation: Rotation;
  locked?: boolean;
}

export interface TileState {
  row: number;
  col: number;
  type: TileType;
  rotation: Rotation;
  /** Monotonically increasing visual rotation in degrees for smooth clockwise CSS transitions. */
  visualRotation: number;
  locked: boolean;
}

export interface LevelDefinition {
  id: number;
  regionId: RegionId;
  /** Destination identifier for campaign levels (optional for daily/friend templates). */
  destinationId?: DestinationId;
  titleFa: string;
  subtitleFa: string;
  difficulty: Difficulty;
  rows: number;
  cols: number;
  source: GridPosition;
  /** Primary destination coordinate (first destination in destinations). */
  destination: GridPosition;
  /** All destination coordinates that must receive water without leaks. */
  destinations: GridPosition[];
  expectedMinMoves: number;
  parTimeSec: number;
  grid: TileDefinition[][];
}

export interface RegionTheme {
  accentHex: string;
  secondaryHex: string;
  surfaceClass: string;
  borderClass: string;
}

export interface DestinationDefinition {
  id: DestinationId;
  regionId: RegionId;
  order: number;
  nameFa: string;
  nameEn: string;
  taglineFa: string;
  descriptionFa: string;
  levelIds: readonly [number, number];
  accentHex: string;
  secondaryHex: string;
}

export interface RegionDefinition {
  id: RegionId;
  order: number;
  nameFa: string;
  titleFa: string;
  subtitleFa: string;
  storyFa: string;
  unlockRequirementFa: string;
  completionStoryFa: string;
  destinationIds: readonly DestinationId[];
  levelIds: readonly number[];
  /** Level ID whose completion unlocks this region (null for initial region). */
  requiredCompletedLevelId: number | null;
  theme: RegionTheme;
}

export type LeakReason = 'boundary' | 'blocked' | 'empty' | 'mismatch';

export interface LeakPoint {
  row: number;
  col: number;
  direction: Direction;
  reason: LeakReason;
}

export interface FlowTileStep {
  row: number;
  col: number;
  step: number;
  /** Direction water entered this tile from (null for source). */
  enteredFrom: Direction | null;
  /** Directions through which water exited this tile to valid connected neighbors. */
  exitsTo: Direction[];
  /** Directions on this reached tile that leaked water. */
  leakDirections: Direction[];
}

export interface InvalidPathBranch {
  tiles: GridPosition[];
  leak: LeakPoint;
}

export interface SimulationResult {
  /** Keyed by "row,col" for O(1) lookup by renderer. */
  flowMap: Record<string, FlowTileStep>;
  /** Ordered list of reached tiles sorted by BFS step. */
  orderedSteps: FlowTileStep[];
  /** Maximum BFS depth reached. */
  maxStep: number;
  /** All tile coordinates reached by water from source. */
  connectedTiles: GridPosition[];
  /** Movable/pipe tiles that were NOT reached by water. */
  disconnectedPipeTiles: GridPosition[];
  /** Exact water leak points on reached tiles. */
  leaks: LeakPoint[];
  /** Destinations that received water. */
  reachedDestinations: GridPosition[];
  /** Destinations that did NOT receive water. */
  unreachedDestinations: GridPosition[];
  /** True when every destination on the board was reached by water. */
  allDestinationsReached: boolean;
  /** Branches leading to leaks. */
  invalidPaths: InvalidPathBranch[];
  /** True iff all destinations are reached AND there are zero leaks. */
  isValidSolution: boolean;
}

export interface ScoreResult {
  stars: 1 | 2 | 3;
  score: number;
  rotations: number;
  expectedMinMoves: number;
  elapsedSeconds: number;
  hintsUsed: number;
}

export interface HintSuggestion {
  row: number;
  col: number;
  rotationsNeeded: number;
  targetRotation: Rotation;
}

export interface LevelProgressRecord {
  levelId: number;
  completed: boolean;
  bestStars: 0 | 1 | 2 | 3;
  bestScore: number;
  bestMoves: number;
  bestTimeSec: number;
  completedAt: string;
  completionsCount?: number;
  totalRotations?: number;
  totalTimeSec?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  showLeakHints: boolean;
}

export interface SavedProgress {
  version: number;
  lastPlayedLevelId: number;
  highestUnlockedLevelId: number;
  unlockedRegions: RegionId[];
  lastSelectedRegionId: RegionId;
  seenStoryIds: string[];
  levels: Record<number, LevelProgressRecord>;
}

export interface RegionProgressSummary {
  regionId: RegionId;
  unlocked: boolean;
  completedCount: number;
  totalCount: number;
  completionPercent: number;
  earnedStars: number;
  maxStars: number;
  isCompleted: boolean;
  nextPlayableLevelId: number | null;
}

export interface DestinationProgressSummary {
  destinationId: DestinationId;
  regionId: RegionId;
  unlocked: boolean;
  completedCount: number;
  totalCount: number;
  completionPercent: number;
  earnedStars: number;
  maxStars: number;
  isCompleted: boolean;
  nextPlayableLevelId: number | null;
}

export interface CampaignProgressSummary {
  completedLevels: number;
  totalLevels: number;
  completionPercent: number;
  earnedStars: number;
  maxStars: number;
  unlockedRegionsCount: number;
  totalRegionsCount: number;
  highestUnlockedLevelId: number;
  isCampaignCompleted: boolean;
}

export type StoryMilestoneKind =
  | 'region_enter'
  | 'first_level'
  | 'region_complete'
  | 'region_unlocked'
  | 'campaign_complete';

export interface StoryMoment {
  id: string;
  kind: StoryMilestoneKind;
  regionId?: RegionId;
  titleFa: string;
  bodyFa: string;
  ctaFa: string;
}

export type AppScreen =
  | 'home'
  | 'map'
  | 'levels'
  | 'playing'
  | 'settings'
  | 'daily'
  | 'friend'
  | 'stats';

export type GameMode = 'campaign' | 'daily' | 'friend';

export type DailyPerformanceTier = 'master' | 'engineer' | 'guardian' | 'striver';

export interface DailyScoreResult {
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  score: number;
  rotations: number;
  expectedMinMoves: number;
  elapsedSeconds: number;
  hintsUsed: number;
  restarts: number;
  performanceTier: DailyPerformanceTier | null;
  performanceLabelFa: string;
}

export interface PuzzleTemplateDefinition {
  id: string;
  numericIndex: number;
  titleFa: string;
  introFa: string;
  difficulty: Difficulty;
  rows: number;
  cols: number;
  source: GridPosition;
  destination: GridPosition;
  destinations: GridPosition[];
  parTimeSec: number;
  grid: TileDefinition[][];
}

export interface DailyChallengeDefinition {
  challengeId: string;
  dateKey: string;
  algoVersion: number;
  seed: number;
  templateId: string;
  persianDateFa: string;
  titleFa: string;
  introFa: string;
  difficulty: Difficulty;
  level: LevelDefinition;
}

export interface FriendChallengeDefinition {
  challengeId: string;
  algoVersion: number;
  templateId: string;
  seed: number;
  titleFa: string;
  introFa: string;
  difficulty: Difficulty;
  level: LevelDefinition;
}

export interface DailyStreakState {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDateKey: string | null;
}

export interface DailyChallengeRecord {
  dateKey: string;
  algoVersion: number;
  completed: boolean;
  bestScore: number;
  bestStars: 0 | 1 | 2 | 3;
  bestMoves: number;
  bestTimeSec: number;
  bestHintsUsed: number;
  bestRestarts: number;
  performanceLabelFa: string;
  attemptsCount: number;
  completionsCount: number;
  totalRotations: number;
  totalTimeSec: number;
  firstCompletedAt: string;
  lastPlayedAt: string;
}

export interface FriendChallengeRecord {
  challengeId: string;
  templateId: string;
  algoVersion: number;
  seed: number;
  titleFa: string;
  completed: boolean;
  bestScore: number;
  bestStars: 0 | 1 | 2 | 3;
  bestMoves: number;
  bestTimeSec: number;
  bestHintsUsed: number;
  bestRestarts: number;
  performanceLabelFa: string;
  completionsCount: number;
  totalRotations: number;
  totalTimeSec: number;
  completedAt: string;
}

export interface ArchivedEngagementTotals {
  prunedDailyCompletedCount: number;
  prunedDailyStars: number;
  prunedDailyRotations: number;
  prunedDailyTimeSec: number;
  prunedDailyBestScore: number;
  prunedFriendCompletedCount: number;
  prunedFriendStars: number;
  prunedFriendRotations: number;
  prunedFriendTimeSec: number;
}

export interface SavedEngagementData {
  version: number;
  streak: DailyStreakState;
  dailyRecords: Record<string, DailyChallengeRecord>;
  friendRecords: Record<string, FriendChallengeRecord>;
  archivedTotals: ArchivedEngagementTotals;
}

export interface PersonalStatistics {
  campaignLevelsCompleted: number;
  campaignTotalLevels: number;
  campaignCompletionPercent: number;
  campaignStarsEarned: number;
  campaignMaxStars: number;
  totalStarsEarned: number;
  totalPuzzlesSolved: number;
  totalRotationsPerformed: number;
  averageCompletionTimeSec: number;
  bestDailyChallengeScore: number;
  currentDailyStreak: number;
  longestDailyStreak: number;
  dailyChallengesCompleted: number;
  friendChallengesCompleted: number;
  hasAnyActivity: boolean;
}

