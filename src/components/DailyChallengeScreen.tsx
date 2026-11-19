import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  RotateCw,
  Share2,
  Star,
  Trophy,
} from 'lucide-react';
import { DIFFICULTY_LABELS_FA } from '../campaign/regions';
import { getEffectiveStreak } from '../engagement/dailyStreak';
import {
  formatCountdownPersian,
  getMsUntilNextTehranDay,
} from '../engagement/tehranTime';
import { formatTimePersian, toPersianDigits } from '../engine/scoring';
import type {
  DailyChallengeDefinition,
  SavedEngagementData,
} from '../engine/types';
import { EdgeStatusBar } from './EdgeStatusBar';
import { LeaderboardPanel } from './LeaderboardPanel';

interface DailyChallengeScreenProps {
  dailyChallenge: DailyChallengeDefinition;
  engagement: SavedEngagementData;
  onStartDaily: () => void;
  onShareDailyAsFriend: () => void;
  onBackHome: () => void;
}

export function DailyChallengeScreen({
  dailyChallenge,
  engagement,
  onStartDaily,
  onShareDailyAsFriend,
  onBackHome,
}: DailyChallengeScreenProps) {
  const [countdownMs, setCountdownMs] = useState<number>(() => getMsUntilNextTehranDay());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdownMs(getMsUntilNextTehranDay());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const todayRecord = engagement.dailyRecords[dailyChallenge.dateKey];
  const isCompletedToday = Boolean(todayRecord?.completed);
  const streakView = getEffectiveStreak(engagement.streak, dailyChallenge.dateKey);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-[#111922] via-[#15120F] to-[#120E0B] text-[#F5ECD7] flex flex-col">
      {/* Compact Sticky Top Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-[#463524] bg-[#17130F]/95">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            data-testid="daily-back-home"
            onClick={onBackHome}
            aria-label="بازگشت به صفحه اصلی"
            className="min-h-[44px] px-3 rounded-lg text-[#E6BA5E] hover:bg-[#2A2018] flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap shrink-0"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>صفحه اصلی</span>
          </button>

          <h1 className="font-display text-xl sm:text-2xl text-[#FBF4E4] truncate">
            چالش روزانه
          </h1>

          <div className="w-20 hidden sm:block" aria-hidden="true" />
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex flex-col gap-5">
        {/* Daily Hero Card with Subtle Persian Geometric Tile Motif */}
        <section
          aria-labelledby="daily-puzzle-title"
          className="relative overflow-hidden rounded-2xl bg-[#1D1712] border border-[#4D3B28]"
        >
          {/* Decorative Persian geometric arch band */}
          <div className="relative h-28 sm:h-32 w-full overflow-hidden border-b border-[#3A2D21] bg-gradient-to-l from-[#12333D] via-[#1B2B33] to-[#261D15]">
            <svg
              className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
              viewBox="0 0 600 140"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <pattern id="daily-qanat-geo" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M20 2 L38 20 L20 38 L2 20 Z"
                    fill="none"
                    stroke="#5BE8F5"
                    strokeWidth="1"
                  />
                  <circle cx="20" cy="20" r="3" fill="#D99B26" />
                </pattern>
              </defs>
              <rect width="600" height="140" fill="url(#daily-qanat-geo)" />
              <path
                d="M0 115 Q150 72 300 115 T600 115 L600 140 L0 140 Z"
                fill="#14110E"
                opacity="0.55"
              />
            </svg>

            <div className="relative z-10 h-full px-5 sm:px-6 py-4 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-[#CBEFF2]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-[#5BE8F5] shrink-0" aria-hidden="true" />
                  <span data-testid="daily-persian-date">{dailyChallenge.persianDateFa}</span>
                </span>
                <span className="text-[#E6BA5E] font-medium tabular-nums">
                  {DIFFICULTY_LABELS_FA[dailyChallenge.difficulty]} · {toPersianDigits(dailyChallenge.level.rows)}×
                  {toPersianDigits(dailyChallenge.level.cols)}
                </span>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2
                    id="daily-puzzle-title"
                    data-testid="daily-title"
                    className="font-display text-2xl sm:text-3xl text-[#FBF4E4] leading-tight"
                  >
                    {dailyChallenge.titleFa}
                  </h2>
                </div>

                <div
                  data-testid="daily-status-label"
                  className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold shrink-0 ${
                    isCompletedToday ? 'text-[#7DF8C4]' : 'text-[#F2CA70]'
                  }`}
                >
                  {isCompletedToday && (
                    <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{isCompletedToday ? 'تکمیل شده' : 'آماده بازی'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 flex flex-col gap-5">
            <p className="text-sm sm:text-base text-[#D7C6AA] leading-relaxed">
              {dailyChallenge.introFa}
            </p>

            {/* Clean Unboxed Metadata & Tehran Countdown Strip */}
            <div className="py-3.5 border-y border-[#35291E] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 tabular-nums">
              <div className="flex items-center justify-between sm:block">
                <span className="text-xs text-[#B59F7E] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5BE8F5]" aria-hidden="true" />
                  <span>تا چالش بعدی (وقت تهران)</span>
                </span>
                <span
                  dir="ltr"
                  data-testid="daily-countdown"
                  className="text-base sm:text-lg font-bold text-[#6CECF5] sm:mt-1 inline-block"
                >
                  {formatCountdownPersian(countdownMs)}
                </span>
              </div>

              <div className="flex items-center justify-between sm:block">
                <span className="text-xs text-[#B59F7E] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#F2BE4E]" aria-hidden="true" />
                  <span>زنجیره روزانه فعلی</span>
                </span>
                <span
                  data-testid="daily-current-streak"
                  className="text-base sm:text-lg font-bold text-[#FBF4E4] sm:mt-1 block"
                >
                  {toPersianDigits(streakView.currentStreak)} روز
                </span>
              </div>

              <div className="flex items-center justify-between sm:block">
                <span className="text-xs text-[#B59F7E] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#E6BA5E]" aria-hidden="true" />
                  <span>طولانی‌ترین زنجیره</span>
                </span>
                <span
                  data-testid="daily-longest-streak"
                  className="text-base sm:text-lg font-bold text-[#E6BA5E] sm:mt-1 block"
                >
                  {toPersianDigits(streakView.longestStreak)} روز
                </span>
              </div>
            </div>

            {/* Today's Best Performance Summary (when completed) */}
            {isCompletedToday && todayRecord ? (
              <div
                data-testid="daily-best-summary"
                className="rounded-xl bg-[#152529] border border-[#246672] p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <span className="text-xs text-[#9CD3DA] block">بهترین عملکرد امروز</span>
                    <span
                      data-testid="daily-performance-label"
                      className="text-base sm:text-lg font-bold text-[#F2BE4E]"
                    >
                      {todayRecord.performanceLabelFa}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1"
                    aria-label={`${toPersianDigits(todayRecord.bestStars)} ستاره از ۳`}
                  >
                    {[1, 2, 3].map((idx) => (
                      <Star
                        key={idx}
                        className={`w-5 h-5 ${
                          idx <= todayRecord.bestStars
                            ? 'text-[#F2BE4E] fill-[#F2BE4E]'
                            : 'text-[#364B52]'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#22444D] text-center tabular-nums">
                  <div>
                    <span className="block text-[11px] text-[#9AC0C7]">بهترین امتیاز</span>
                    <span
                      data-testid="daily-best-score"
                      className="block text-base sm:text-lg font-bold text-[#FBF4E4] mt-0.5"
                    >
                      {toPersianDigits(todayRecord.bestScore)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#9AC0C7]">کمترین چرخش</span>
                    <span className="block text-base sm:text-lg font-bold text-[#FBF4E4] mt-0.5">
                      {toPersianDigits(todayRecord.bestMoves)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#9AC0C7]">بهترین زمان</span>
                    <span
                      dir="ltr"
                      className="block text-base sm:text-lg font-bold text-[#6CECF5] mt-0.5"
                    >
                      {formatTimePersian(todayRecord.bestTimeSec)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-[#BBA788] flex flex-wrap items-center gap-x-3 gap-y-1 tabular-nums">
                <span>حداقل حرکت مورد انتظار: {toPersianDigits(dailyChallenge.level.expectedMinMoves)}</span>
                <span aria-hidden="true">·</span>
                <span>زمان معیار: {formatTimePersian(dailyChallenge.level.parTimeSec)}</span>
                <span aria-hidden="true">·</span>
                <span>معمای مشترک امروز برای همه بازیکنان</span>
              </div>
            )}

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                data-testid="btn-start-daily"
                onClick={onStartDaily}
                className="flex-1 min-h-[50px] px-6 py-3 rounded-xl bg-[#D99B26] hover:bg-[#E5AA36] active:scale-[0.98] text-[#1A130C] font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_22px_rgba(217,155,38,0.28)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4] whitespace-nowrap"
              >
                {isCompletedToday ? (
                  <>
                    <RotateCw className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>تکرار چالش امروز</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current shrink-0" aria-hidden="true" />
                    <span>شروع چالش امروز</span>
                  </>
                )}
              </button>

              <button
                type="button"
                data-testid="btn-share-daily-as-friend"
                onClick={onShareDailyAsFriend}
                className="min-h-[50px] px-5 py-3 rounded-xl bg-[#163640] hover:bg-[#1C4652] border border-[#248A99] text-[#E6FAFC] font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5] whitespace-nowrap"
              >
                <Share2 className="w-4 h-4 text-[#5BE8F5] shrink-0" aria-hidden="true" />
                <span>ارسال برای دوستان</span>
              </button>
            </div>
          </div>
        </section>

        {/* Live Edge API Availability Status */}
        <EdgeStatusBar compact />

        {/* Server-Backed Global Daily Leaderboard (Honest STORAGE_NOT_CONFIGURED / Offline / Persisted States) */}
        <LeaderboardPanel
          mode="daily"
          dateKey={dailyChallenge.dateKey}
          challengeId={dailyChallenge.challengeId}
          titleFa="جدول امتیازات جهانی چالش امروز"
        />

        {/* Transparent Offline Scope & Rules Note */}
        <section className="rounded-2xl bg-[#1A1510] border border-[#35291E] p-4 sm:p-5 text-xs sm:text-sm text-[#B8A485] leading-relaxed">
          <p>
            معمای روزانه بر اساس تاریخ رسمی ایران (منطقه زمانی تهران) و به صورت کاملاً یکسان برای همه بازیکنان ساخته می‌شود. تکمیل چالش روزانه تأثیری بر باز شدن مراحل کمپین ندارد و بهترین رکورد شخصی شما همیشه به صورت آفلاین روی این دستگاه نگهداری می‌شود.
          </p>
        </section>
      </main>
    </div>
  );
}
