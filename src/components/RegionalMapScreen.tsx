import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Eye, Lock, MapPin, Star } from 'lucide-react';
import { getDestinationsByRegion } from '../campaign/destinations';
import {
  getCampaignSummary,
  getDestinationProgress,
  getRegionProgress,
} from '../campaign/progression';
import { REGIONS } from '../campaign/regions';
import { toPersianDigits } from '../engine/scoring';
import type { RegionId, SavedProgress } from '../engine/types';
import { RegionArtworkSvg } from './RegionArtworkSvg';

interface RegionalMapScreenProps {
  progress: SavedProgress;
  onSelectRegion: (regionId: RegionId) => void;
  onBackHome: () => void;
}

export function RegionalMapScreen({
  progress,
  onSelectRegion,
  onBackHome,
}: RegionalMapScreenProps) {
  const campaign = getCampaignSummary(progress);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-[#111922] via-[#15120F] to-[#120E0B] text-[#F5ECD7] flex flex-col overflow-x-hidden">
      {/* Compact Perimeter Top Header */}
      <header className="w-full border-b border-[#463524] bg-[#17130F]/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackHome}
            aria-label="بازگشت به صفحه اصلی"
            className="min-h-[44px] px-3 rounded-lg text-[#E6BA5E] hover:bg-[#2A2018] flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap shrink-0"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>خانه</span>
          </button>

          <h1 className="font-display text-lg sm:text-2xl text-[#FBF4E4] truncate">
            نقشه سفر قنات‌های ایران
          </h1>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E6BA5E] tabular-nums whitespace-nowrap shrink-0">
            <Star className="w-4 h-4 fill-[#E6BA5E]" aria-hidden="true" />
            <span>
              {toPersianDigits(campaign.earnedStars)} / {toPersianDigits(campaign.maxStars)}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex flex-col gap-6">
        {/* Overall 100-Level / 50-Destination / 12-Route Progress Summary */}
        <section
          aria-label="خلاصه پیشرفت کل کمپین"
          className="rounded-2xl bg-[#1D1712] border border-[#463626] p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 font-semibold text-[#FBF4E4]">
              <Compass className="w-4 h-4 text-[#23B8CA] shrink-0" aria-hidden="true" />
              <span>پیشرفت کلی سفر ایران (۱۲ مسیر · ۵۰ مقصد)</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#D6C19D] tabular-nums">
              <span data-testid="map-campaign-progress">
                مراحل تکمیل‌شده: {toPersianDigits(campaign.completedLevels)} از{' '}
                {toPersianDigits(campaign.totalLevels)}
              </span>
              <span aria-hidden="true" className="text-[#785E3E]">
                ·
              </span>
              <span className="font-bold text-[#6CECF5]">
                {toPersianDigits(campaign.completionPercent)}٪
              </span>
            </div>
          </div>

          <div
            className="mt-3 h-2.5 w-full rounded-full bg-[#2C221A] overflow-hidden"
            role="progressbar"
            aria-valuenow={campaign.completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="درصد تکمیل کل کمپین"
          >
            <div
              className="h-full rounded-full bg-[#19A7B8] transition-all duration-300"
              style={{ width: `${campaign.completionPercent}%` }}
            />
          </div>

          <p className="mt-2.5 text-xs text-[#BCA786]">
            {campaign.isCampaignCompleted
              ? 'هر ۱۲ مسیر و ۵۰ مقصد ایران احیا شدند! می‌توانید هر مرحله را برای ثبت رکورد بهتر تکرار کنید.'
              : `مسیرهای بازشده: ${toPersianDigits(campaign.unlockedRegionsCount)} از ${toPersianDigits(
                  campaign.totalRegionsCount,
                )} · با تکمیل مراحل هر مسیر، مسیر بعدی به ترتیب باز می‌شود.`}
          </p>

          {/* Quick-Jump 12-Route Strip (2x6, 4x3, 6x2 — zero orphan slots across all breakpoints) */}
          <nav
            aria-label="دسترسی سریع به دوازده مسیر ایران"
            className="mt-4 pt-3.5 border-t border-[#34281E] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5"
          >
            {REGIONS.map((region) => {
              const rStats = getRegionProgress(progress, region.id);
              const shortName =
                region.id === 'kashan'
                  ? 'کاشان'
                  : region.id === 'isfahan'
                    ? 'اصفهان'
                    : region.id === 'northwest'
                      ? 'شمال‌غرب'
                      : region.id === 'shahsavan'
                        ? 'شاهسون'
                        : region.id === 'turkmen_sahra'
                          ? 'ترکمن‌صحرا'
                          : region.nameFa;

              return (
                <button
                  key={region.id}
                  type="button"
                  data-testid={`map-jump-${region.id}`}
                  onClick={() => {
                    const target = document.getElementById(`route-card-${region.id}`);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`min-h-[44px] px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] tabular-nums ${
                    rStats.isCompleted
                      ? 'bg-[#122D2D] border-[#257B7B]/70 text-[#B8FCE4] hover:bg-[#173A3A]'
                      : rStats.unlocked
                        ? 'bg-[#251E17] border-[#6B5135] text-[#FBF4E4] hover:bg-[#2F251C]'
                        : 'bg-[#17130F] border-[#33271D] text-[#A28E73] hover:bg-[#211B15]'
                  }`}
                >
                  <span className="truncate">
                    {toPersianDigits(region.order)}. {shortName}
                  </span>
                  {rStats.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7DF8C4] shrink-0" aria-hidden="true" />
                  ) : rStats.unlocked ? (
                    <span className="text-[11px] text-[#6CECF5] shrink-0">
                      {toPersianDigits(rStats.completedCount)}/{toPersianDigits(rStats.totalCount)}
                    </span>
                  ) : (
                    <Lock className="w-3 h-3 text-[#7D6B57] shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </nav>
        </section>

        {/* Interactive 12-Route Journey Grid (6 balanced 2-column rows on md+) */}
        <section aria-label="دوازده مسیر ایران" className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REGIONS.map((region, idx) => {
              const stats = getRegionProgress(progress, region.id);
              const destinations = getDestinationsByRegion(region.id);
              const isCurrentFrontier =
                stats.unlocked &&
                !stats.isCompleted &&
                stats.nextPlayableLevelId !== null;

              return (
                <div
                  key={region.id}
                  id={`route-card-${region.id}`}
                  className="flex flex-col scroll-mt-20"
                >
                  {/* Mobile vertical route connector between routes */}
                  {idx > 0 && (
                    <div
                      aria-hidden="true"
                      className="md:hidden mx-auto -mt-3 mb-2 h-5 w-0.5 rounded-full"
                      style={{
                        backgroundColor: stats.unlocked ? region.theme.accentHex : '#3C2F22',
                      }}
                    />
                  )}

                  <article
                    data-testid={`region-card-${region.id}`}
                    data-unlocked={stats.unlocked ? 'true' : 'false'}
                    className={`flex-1 flex flex-col rounded-2xl overflow-hidden border transition-all duration-200 ${
                      !stats.unlocked
                        ? 'bg-[#191512] border-[#372B21]'
                        : isCurrentFrontier
                          ? 'bg-[#1D2528] border-[#1FAEC0] shadow-[0_12px_32px_rgba(19,153,168,0.18)]'
                          : 'bg-[#1E1812] border-[#614B33]'
                    }`}
                  >
                    {/* Custom Illustrated Route Scene */}
                    <div className="relative">
                      <RegionArtworkSvg regionId={region.id} locked={!stats.unlocked} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16120E] via-transparent to-transparent" />

                      {/* Route Order Marker & Status */}
                      <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2 text-xs font-semibold">
                        <span className="px-2.5 py-1 rounded-lg bg-[#14110E]/85 text-[#F2CA70] tabular-nums">
                          مسیر {toPersianDigits(region.order)} · مراحل{' '}
                          {toPersianDigits(region.levelIds[0])} تا{' '}
                          {toPersianDigits(region.levelIds[region.levelIds.length - 1])}
                        </span>

                        {!stats.unlocked ? (
                          <span className="px-2 py-1 rounded-lg bg-[#14110E]/85 text-[#BDA782] flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>قفل‌شده</span>
                          </span>
                        ) : stats.isCompleted ? (
                          <span className="px-2 py-1 rounded-lg bg-[#0F3C3A]/90 text-[#7DF8C4] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>تکمیل</span>
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Route Body */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
                      <div>
                        <h2 className="font-display text-xl sm:text-2xl text-[#FBF4E4] leading-snug">
                          {region.titleFa}
                        </h2>
                        <p
                          className="mt-1 text-xs font-medium"
                          style={{ color: stats.unlocked ? region.theme.accentHex : '#A69276' }}
                        >
                          {region.subtitleFa}
                        </p>
                        <p className="mt-2 text-xs sm:text-sm text-[#CBB896] leading-relaxed">
                          {region.storyFa}
                        </p>

                        {/* Destinations Roster inside this Route (supports 4 or 5 destinations dynamically) */}
                        <div className="mt-3.5 pt-3 border-t border-[#32271D]">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#A89476] mb-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>
                              مقاصد این مسیر ({toPersianDigits(destinations.length)} مقصد ·{' '}
                              {toPersianDigits(region.levelIds.length)} مرحله):
                            </span>
                          </div>
                          <div
                            className={`grid gap-2 ${
                              destinations.length > 4
                                ? 'grid-cols-2 sm:grid-cols-3'
                                : 'grid-cols-2 sm:grid-cols-4'
                            }`}
                          >
                            {destinations.map((dest, destIdx) => {
                              const dStats = getDestinationProgress(progress, dest.id);
                              const spanBalanced =
                                destinations.length === 5 && destIdx === 4 ? 'col-span-2 sm:col-span-2' : '';
                              return (
                                <div
                                  key={dest.id}
                                  data-testid={`map-dest-${dest.id}`}
                                  className={`px-2.5 py-1.5 rounded-lg bg-[#16120E]/80 border border-[#34291E] flex items-center justify-between gap-1 text-xs tabular-nums ${spanBalanced}`}
                                >
                                  <span
                                    className={`font-semibold truncate ${
                                      dStats.unlocked ? 'text-[#F5ECD7]' : 'text-[#96836A]'
                                    }`}
                                  >
                                    {dest.nameFa}
                                  </span>
                                  {dStats.isCompleted ? (
                                    <CheckCircle2
                                      className="w-3.5 h-3.5 text-[#7DF8C4] shrink-0"
                                      aria-hidden="true"
                                    />
                                  ) : dStats.unlocked ? (
                                    <span className="text-[11px] text-[#6CECF5] shrink-0">
                                      {toPersianDigits(dStats.completedCount)}/۲
                                    </span>
                                  ) : (
                                    <Lock
                                      className="w-3 h-3 text-[#776652] shrink-0"
                                      aria-hidden="true"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div>
                        {/* Regional Stats Row */}
                        <div className="flex items-center justify-between text-xs text-[#D6C19D] tabular-nums mb-2">
                          <span>
                            تکمیل: {toPersianDigits(stats.completedCount)} از{' '}
                            {toPersianDigits(stats.totalCount)} ({toPersianDigits(stats.completionPercent)}٪)
                          </span>
                          <span className="flex items-center gap-1 text-[#E6BA5E] font-semibold">
                            <Star className="w-3.5 h-3.5 fill-[#E6BA5E]" aria-hidden="true" />
                            <span>
                              {toPersianDigits(stats.earnedStars)} / {toPersianDigits(stats.maxStars)}
                            </span>
                          </span>
                        </div>

                        {/* Regional Progress Bar */}
                        <div className="h-2 w-full rounded-full bg-[#2B221A] overflow-hidden mb-4">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${stats.completionPercent}%`,
                              backgroundColor: stats.unlocked ? region.theme.accentHex : '#57483A',
                            }}
                          />
                        </div>

                        {/* Functional Action Button */}
                        {stats.unlocked ? (
                          <button
                            type="button"
                            data-testid={`enter-region-${region.id}`}
                            onClick={() => onSelectRegion(region.id)}
                            className={`w-full min-h-[46px] px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4] active:scale-[0.98] whitespace-nowrap ${
                              isCurrentFrontier
                                ? 'bg-[#D99B26] hover:bg-[#E5AA36] text-[#1A130C]'
                                : 'bg-[#17414C] hover:bg-[#1E5361] text-[#EBF9FA] border border-[#288B9A]/60'
                            }`}
                          >
                            <span>
                              {stats.isCompleted
                                ? `مشاهده مقاصد ${region.nameFa}`
                                : stats.completedCount > 0
                                  ? `ادامه در مسیر ${region.nameFa}`
                                  : `ورود به مسیر ${region.nameFa}`}
                            </span>
                            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                          </button>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div
                              data-testid={`locked-region-${region.id}`}
                              className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-[#221B15] border border-[#3E3024] text-[#BDA889] text-xs font-medium flex items-center justify-center gap-2 text-center"
                            >
                              <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              <span>{region.unlockRequirementFa}</span>
                            </div>
                            <button
                              type="button"
                              data-testid={`enter-region-${region.id}`}
                              onClick={() => onSelectRegion(region.id)}
                              className="w-full min-h-[44px] px-4 rounded-xl bg-[#1D1814] hover:bg-[#282019] border border-[#47382A] text-[#D7C4A3] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
                              <span>پیش‌نمایش مقاصد {region.nameFa}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
