import { getCampaignSummary } from '../campaign/progression';
import type {
  PersonalStatistics,
  SavedEngagementData,
  SavedProgress,
} from '../engine/types';
import { getEffectiveStreak } from './dailyStreak';
import { getTehranDateKey } from './tehranTime';

/**
 * Derive all personal statistics strictly from real saved campaign, daily, and friend records.
 * Never fabricates or estimates unrecorded data.
 */
export function computePersonalStatistics(
  progress: SavedProgress,
  engagement: SavedEngagementData,
  todayTehranKey: string = getTehranDateKey(),
): PersonalStatistics {
  const campaign = getCampaignSummary(progress);

  // Campaign records
  const completedCampaignRecords = Object.values(progress.levels).filter((r) => r.completed);
  let campaignSolvedRuns = 0;
  let campaignRotations = 0;
  let campaignTotalTimeSec = 0;

  for (const rec of completedCampaignRecords) {
    const runs = rec.completionsCount && rec.completionsCount > 0 ? rec.completionsCount : 1;
    const rots = rec.totalRotations && rec.totalRotations > 0 ? rec.totalRotations : rec.bestMoves;
    const time = rec.totalTimeSec && rec.totalTimeSec > 0 ? rec.totalTimeSec : rec.bestTimeSec;
    campaignSolvedRuns += runs;
    campaignRotations += rots;
    campaignTotalTimeSec += time;
  }

  // Daily records + archived pruned daily totals
  const completedDailyRecords = Object.values(engagement.dailyRecords).filter((r) => r.completed);
  let dailyStarsEarned = engagement.archivedTotals.prunedDailyStars;
  let dailyCompletedUnique = engagement.archivedTotals.prunedDailyCompletedCount;
  let dailySolvedRuns = engagement.archivedTotals.prunedDailyCompletedCount;
  let dailyRotations = engagement.archivedTotals.prunedDailyRotations;
  let dailyTotalTimeSec = engagement.archivedTotals.prunedDailyTimeSec;
  let bestDailyChallengeScore = engagement.archivedTotals.prunedDailyBestScore;

  for (const rec of completedDailyRecords) {
    dailyCompletedUnique += 1;
    dailyStarsEarned += rec.bestStars;
    dailySolvedRuns += Math.max(1, rec.completionsCount);
    dailyRotations += Math.max(rec.bestMoves, rec.totalRotations);
    dailyTotalTimeSec += Math.max(rec.bestTimeSec, rec.totalTimeSec);
    if (rec.bestScore > bestDailyChallengeScore) {
      bestDailyChallengeScore = rec.bestScore;
    }
  }

  // Friend challenge records + archived pruned friend totals
  const completedFriendRecords = Object.values(engagement.friendRecords).filter((r) => r.completed);
  let friendStarsEarned = engagement.archivedTotals.prunedFriendStars;
  let friendCompletedUnique = engagement.archivedTotals.prunedFriendCompletedCount;
  let friendSolvedRuns = engagement.archivedTotals.prunedFriendCompletedCount;
  let friendRotations = engagement.archivedTotals.prunedFriendRotations;
  let friendTotalTimeSec = engagement.archivedTotals.prunedFriendTimeSec;

  for (const rec of completedFriendRecords) {
    friendCompletedUnique += 1;
    friendStarsEarned += rec.bestStars;
    friendSolvedRuns += Math.max(1, rec.completionsCount);
    friendRotations += Math.max(rec.bestMoves, rec.totalRotations);
    friendTotalTimeSec += Math.max(rec.bestTimeSec, rec.totalTimeSec);
  }

  const totalStarsEarned = campaign.earnedStars + dailyStarsEarned + friendStarsEarned;
  const totalPuzzlesSolved = campaignSolvedRuns + dailySolvedRuns + friendSolvedRuns;
  const totalRotationsPerformed = campaignRotations + dailyRotations + friendRotations;
  const combinedTimeSec = campaignTotalTimeSec + dailyTotalTimeSec + friendTotalTimeSec;
  const averageCompletionTimeSec =
    totalPuzzlesSolved > 0 ? Math.round(combinedTimeSec / totalPuzzlesSolved) : 0;

  const streakView = getEffectiveStreak(engagement.streak, todayTehranKey);

  const hasAnyActivity =
    campaign.completedLevels > 0 ||
    dailyCompletedUnique > 0 ||
    friendCompletedUnique > 0;

  return {
    campaignLevelsCompleted: campaign.completedLevels,
    campaignTotalLevels: campaign.totalLevels,
    campaignCompletionPercent: campaign.completionPercent,
    campaignStarsEarned: campaign.earnedStars,
    campaignMaxStars: campaign.maxStars,
    totalStarsEarned,
    totalPuzzlesSolved,
    totalRotationsPerformed,
    averageCompletionTimeSec,
    bestDailyChallengeScore,
    currentDailyStreak: streakView.currentStreak,
    longestDailyStreak: streakView.longestStreak,
    dailyChallengesCompleted: dailyCompletedUnique,
    friendChallengesCompleted: friendCompletedUnique,
    hasAnyActivity,
  };
}
