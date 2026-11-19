import {
  ArrowRight,
  BarChart3,
  Calendar,
  Compass,
  Play,
  Star,
} from 'lucide-react';
import { getRegionProgress } from '../campaign/progression';
import { REGIONS } from '../campaign/regions';
import { computePersonalStatistics } from '../engagement/statistics';
import { formatTimePersian, toPersianDigits } from '../engine/scoring';
import type { SavedEngagementData, SavedProgress } from '../engine/types';

interface StatisticsScreenProps {
  progress: SavedProgress;
  engagement: SavedEngagementData;
  todayTehranKey: string;
  onStartCampaign: () => void;
  onOpenDaily: () => void;
  onBackHome: () => void;
}

export function StatisticsScreen({
  progress,
  engagement,
  todayTehranKey,
  onStartCampaign,
  onOpenDaily,
  onBackHome,
}: StatisticsScreenProps) {
  const stats = computePersonalStatistics(progress, engagement, todayTehranKey);

  const metricRows: Array<{
    testId: string;
    label: string;
    value: string;
    subtext?: string;
    accent?: string;
    ltr?: boolean;
  }> = [
    {
      testId: 'stat-total-stars',
      label: 'مجموع ستاره‌های کسب‌شده',
      value: toPersianDigits(stats.totalStarsEarned),
      subtext: `کمپین: ${toPersianDigits(stats.campaignStarsEarned)} از ${toPersianDigits(stats.campaignMaxStars)}`,
      accent: 'text-[#F2BE4E]',
    },
    {
      testId: 'stat-puzzles-solved',
      label: 'کل معماهای حل‌شده',
      value: toPersianDigits(stats.totalPuzzlesSolved),
      accent: 'text-[#6CECF5]',
    },
    {
      testId: 'stat-total-rotations',
      label: 'مجموع چرخش لوله‌ها',
      value: toPersianDigits(stats.totalRotationsPerformed),
      accent: 'text-[#FBF4E4]',
    },
    {
      testId: 'stat-avg-time',
      label: 'میانگین زمان حل معما',
      value: stats.totalPuzzlesSolved > 0 ? formatTimePersian(stats.averageCompletionTimeSec) : '—',
      accent: 'text-[#6CECF5]',
      ltr: stats.totalPuzzlesSolved > 0,
    },
    {
      testId: 'stat-best-daily-score',
      label: 'بهترین امتیاز چالش روزانه',
      value:
        stats.bestDailyChallengeScore > 0
          ? toPersianDigits(stats.bestDailyChallengeScore)
          : '—',
      accent: 'text-[#F2BE4E]',
    },
    {
      testId: 'stat-current-streak',
      label: 'زنجیره فعلی چالش روزانه',
      value: `${toPersianDigits(stats.currentDailyStreak)} روز`,
      accent: 'text-[#7DF8C4]',
    },
    {
      testId: 'stat-longest-streak',
      label: 'طولانی‌ترین زنجیره روزانه',
      value: `${toPersianDigits(stats.longestDailyStreak)} روز`,
      accent: 'text-[#E6BA5E]',
    },
    {
      testId: 'stat-friend-completed',
      label: 'رقابت‌های دوستانه تکمیل‌شده',
      value: toPersianDigits(stats.friendChallengesCompleted),
      accent: 'text-[#FBF4E4]',
    },
  ];

  return (
    <div className="min-h-dvh w-full bg-[#14110E] text-[#F5ECD7] flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full border-b border-[#3A2D21] bg-[#1B1510]/95">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            data-testid="stats-back-home"
            onClick={onBackHome}
            aria-label="بازگشت به صفحه اصلی"
            className="min-h-[44px] px-3 rounded-lg text-[#E6BA5E] hover:bg-[#2A2018] flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap shrink-0"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>صفحه اصلی</span>
          </button>

          <h1 className="font-display text-xl sm:text-2xl text-[#FBF4E4] truncate">
            آمار من
          </h1>

          <div className="w-20 hidden sm:block" aria-hidden="true" />
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex flex-col gap-5">
        {/* Graceful Empty State for New Players */}
        {!stats.hasAnyActivity && (
          <section
            data-testid="stats-empty-state"
            className="rounded-2xl bg-[#1D1712] border border-[#4D3B28] p-5 sm:p-6 text-center flex flex-col items-center gap-3"
          >
            <BarChart3 className="w-8 h-8 text-[#E6BA5E]" aria-hidden="true" />
            <h2 className="font-display text-2xl text-[#FBF4E4]">
              کارنامه قنات‌چی شما آماده ثبت است
            </h2>
            <p className="text-sm text-[#CBB896] max-w-md leading-relaxed">
              هنوز هیچ مرحله یا چالشی به پایان نرسانده‌اید. با حل نخستین قنات، تمام آمارهای واقعی بازی شما در این صفحه ثبت خواهد شد.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onStartCampaign}
                className="min-h-[44px] px-5 rounded-xl bg-[#D99B26] hover:bg-[#E5AA36] text-[#1A130C] font-bold text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>شروع کمپین</span>
              </button>
              <button
                type="button"
                onClick={onOpenDaily}
                className="min-h-[44px] px-5 rounded-xl bg-[#163640] hover:bg-[#1C4652] border border-[#248A99] text-[#E6FAFC] font-semibold text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-[#5BE8F5]" aria-hidden="true" />
                <span>چالش روزانه</span>
              </button>
            </div>
          </section>
        )}

        {/* Campaign Overall Progress Strip (Percentage + Completed Levels) */}
        <section className="rounded-2xl bg-[#1D1712] border border-[#463626] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 tabular-nums">
            <span className="text-sm font-semibold text-[#FBF4E4] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#5BE8F5]" aria-hidden="true" />
              <span>درصد تکمیل کل کمپین</span>
            </span>
            <span
              data-testid="stat-campaign-percent"
              className="text-lg font-bold text-[#6CECF5]"
            >
              {toPersianDigits(stats.campaignCompletionPercent)}٪
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#2B2219] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1CA5B5] transition-all duration-300"
              style={{ width: `${stats.campaignCompletionPercent}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#CBB896] tabular-nums">
            <span>
              مراحل تکمیل‌شده کمپین:{' '}
              <strong data-testid="stat-campaign-completed" className="text-[#FBF4E4]">
                {toPersianDigits(stats.campaignLevelsCompleted)} از{' '}
                {toPersianDigits(stats.campaignTotalLevels)}
              </strong>
            </span>
            <span>
              چالش‌های روزانه حل‌شده: {toPersianDigits(stats.dailyChallengesCompleted)}
            </span>
          </div>
        </section>

        {/* Balanced 8-Tile Personal Statistics Grid (2x4 mobile, 4x2 desktop) */}
        <section
          aria-label="خلاصه آمار شخصی"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums"
        >
          {metricRows.map((metric) => (
            <div
              key={metric.testId}
              className="rounded-xl bg-[#1D1712] border border-[#3D2F22] p-4 flex flex-col justify-between gap-2"
            >
              <span className="text-xs text-[#B8A485] leading-snug">{metric.label}</span>
              <div>
                <span
                  data-testid={metric.testId}
                  dir={metric.ltr ? 'ltr' : undefined}
                  className={`inline-block text-xl sm:text-2xl font-bold leading-tight ${metric.accent ?? 'text-[#FBF4E4]'}`}
                >
                  {metric.value}
                </span>
                {metric.subtext && (
                  <span className="block text-[11px] text-[#9D896C] mt-1">{metric.subtext}</span>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Regional Breakdown */}
        <section className="rounded-2xl bg-[#1D1712] border border-[#3E3022] p-5 flex flex-col gap-3">
          <h2 className="font-semibold text-sm sm:text-base text-[#FBF4E4]">
            پیشرفت به تفکیک مناطق ایران
          </h2>
          <div className="divide-y divide-[#33271D] tabular-nums">
            {REGIONS.map((region) => {
              const rp = getRegionProgress(progress, region.id);
              return (
                <div key={region.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#FBF4E4]">{region.titleFa}</p>
                    <p className="text-xs text-[#B59F7E] mt-0.5">
                      {rp.unlocked
                        ? `${toPersianDigits(rp.completedCount)} از ${toPersianDigits(rp.totalCount)} مرحله (${toPersianDigits(rp.completionPercent)}٪)`
                        : 'قفل‌شده'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#F2BE4E]">
                    <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>
                      {toPersianDigits(rp.earnedStars)}/{toPersianDigits(rp.maxStars)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <p className="text-xs text-[#9D896C] text-center leading-relaxed pb-2">
          تمام این آمارها به صورت مستقیم از رکوردهای واقعی ذخیره‌شده روی همین دستگاه محاسبه می‌شوند و به سرور خارجی ارسال نمی‌شوند.
        </p>
      </main>
    </div>
  );
}
