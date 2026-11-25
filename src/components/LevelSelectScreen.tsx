import { ArrowRight, CheckCircle2, Lock, Map, Play, Star } from 'lucide-react';
import { getDestinationsByRegion } from '../campaign/destinations';
import {
  getCampaignSummary,
  getDestinationProgress,
  getRegionProgress,
  isLevelUnlocked,
  isRegionUnlocked,
} from '../campaign/progression';
import { DIFFICULTY_LABELS_FA, getRegionById, REGIONS } from '../campaign/regions';
import { formatTimePersian, toPersianDigits } from '../engine/scoring';
import type { RegionId, SavedProgress } from '../engine/types';
import { getLevelsByDestination } from '../levels/levels';
import { DestinationArtworkSvg } from './DestinationArtworkSvg';

interface LevelSelectScreenProps {
  progress: SavedProgress;
  selectedRegionId: RegionId;
  onChangeRegion: (regionId: RegionId) => void;
  onSelectLevel: (levelId: number) => void;
  onOpenMap: () => void;
  onBackHome: () => void;
}

export function LevelSelectScreen({
  progress,
  selectedRegionId,
  onChangeRegion,
  onSelectLevel,
  onOpenMap,
  onBackHome,
}: LevelSelectScreenProps) {
  const activeRegion = getRegionById(selectedRegionId);
  const regionStats = getRegionProgress(progress, selectedRegionId);
  const regionDestinations = getDestinationsByRegion(selectedRegionId);
  const campaignSummary = getCampaignSummary(progress);

  return (
    <div className="min-h-dvh w-full bg-[#14110E] text-[#F5ECD7] flex flex-col overflow-x-hidden">
      {/* Unified Perimeter Top Bar */}
      <header className="w-full border-b border-[#3A2D21] bg-[#1B1510]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenMap}
              aria-label="بازگشت به نقشه مسیرها"
              className="min-h-[44px] px-2.5 sm:px-3 rounded-lg text-[#6CECF5] hover:bg-[#232D30] flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6CECF5] whitespace-nowrap"
            >
              <Map className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>نقشه مسیرها</span>
            </button>
            <button
              type="button"
              onClick={onBackHome}
              aria-label="بازگشت به صفحه اصلی"
              className="min-h-[44px] px-2 rounded-lg text-[#D6B882] hover:bg-[#2A2018] flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap"
            >
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">خانه</span>
            </button>
          </div>

          <h1 className="font-display text-lg sm:text-2xl text-[#FBF4E4] truncate">
            مقاصد و مراحل
          </h1>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E6BA5E] tabular-nums whitespace-nowrap shrink-0">
            <Star className="w-4 h-4 fill-[#E6BA5E]" aria-hidden="true" />
            <span>
              {toPersianDigits(campaignSummary.earnedStars)} / {toPersianDigits(campaignSummary.maxStars)}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7 flex flex-col gap-5">
        {/* Interactive 12-Route Selector Tabs (2x6 mobile, 4x3 tablet, 6x2 desktop — zero orphan slots) */}
        <div
          role="tablist"
          aria-label="فهرست دوازده مسیر کمپین"
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5 p-1.5 rounded-2xl bg-[#1C1611] border border-[#3B2E22]"
        >
          {REGIONS.map((region) => {
            const unlocked = isRegionUnlocked(progress, region.id);
            const stats = getRegionProgress(progress, region.id);
            const isSelected = region.id === selectedRegionId;
            const shortTabName =
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
                role="tab"
                aria-selected={isSelected}
                data-testid={`region-tab-${region.id}`}
                data-unlocked={unlocked ? 'true' : 'false'}
                onClick={() => onChangeRegion(region.id)}
                className={`min-h-[46px] px-2 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex flex-col items-center justify-center gap-0.5 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] ${
                  isSelected
                    ? 'bg-[#282119] text-[#FBF4E4] border border-[#D99B26]/75'
                    : unlocked
                      ? 'text-[#CBB896] hover:bg-[#231C16] hover:text-[#FBF4E4]'
                      : 'text-[#96836B] hover:bg-[#211A14] hover:text-[#CBB896]'
                }`}
              >
                <span className="flex items-center gap-1 max-w-full">
                  {!unlocked && <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />}
                  <span className="truncate">
                    {toPersianDigits(region.order)}. {shortTabName}
                  </span>
                </span>
                <span className="text-[11px] text-[#9E8B70] tabular-nums">
                  {toPersianDigits(stats.completedCount)}/{toPersianDigits(stats.totalCount)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Route Story & Progress Strip */}
        <section className="rounded-2xl bg-[#1D1712] border border-[#463626] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-[#FBF4E4]">
                {activeRegion.titleFa}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#CBB896] leading-relaxed">
                {activeRegion.storyFa}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {!regionStats.unlocked && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#E6BA5E]">
                  <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{activeRegion.unlockRequirementFa}</span>
                </div>
              )}
              {(() => {
                const idx = REGIONS.findIndex((r) => r.id === activeRegion.id);
                const prevRegion = idx > 0 ? REGIONS[idx - 1] : null;
                const nextRegion = idx >= 0 && idx < REGIONS.length - 1 ? REGIONS[idx + 1] : null;
                return (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={!prevRegion}
                      onClick={() => prevRegion && onChangeRegion(prevRegion.id)}
                      className="min-h-[44px] px-2.5 rounded-lg bg-[#241C16] hover:bg-[#30251C] disabled:opacity-40 disabled:cursor-not-allowed border border-[#493827] text-xs font-medium text-[#E6D3B3] transition-colors cursor-pointer"
                    >
                      مسیر قبل
                    </button>
                    <button
                      type="button"
                      disabled={!nextRegion}
                      onClick={() => nextRegion && onChangeRegion(nextRegion.id)}
                      className="min-h-[44px] px-2.5 rounded-lg bg-[#241C16] hover:bg-[#30251C] disabled:opacity-40 disabled:cursor-not-allowed border border-[#493827] text-xs font-medium text-[#E6D3B3] transition-colors cursor-pointer"
                    >
                      مسیر بعد
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#D6C19D] tabular-nums">
            <span>
              پیشرفت مسیر: {toPersianDigits(regionStats.completedCount)} از{' '}
              {toPersianDigits(regionStats.totalCount)} مرحله ({toPersianDigits(regionStats.completionPercent)}٪)
            </span>
            <span className="text-[#E6BA5E] font-semibold">
              ستاره‌ها: {toPersianDigits(regionStats.earnedStars)} از {toPersianDigits(regionStats.maxStars)}
            </span>
          </div>

          <div className="mt-2 h-2 w-full rounded-full bg-[#2C221A] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${regionStats.completionPercent}%`,
                backgroundColor: regionStats.unlocked ? activeRegion.theme.accentHex : '#57483A',
              }}
            />
          </div>
        </section>

        {/* Illustrated Destination Cards (4 or 5 destinations dynamically, each with 2 playable levels) */}
        <section
          aria-label={`مقاصد مسیر ${activeRegion.nameFa}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
        >
          {regionDestinations.map((dest, destIdx) => {
            const destStats = getDestinationProgress(progress, dest.id);
            const destLevels = getLevelsByDestination(dest.id);
            const isWideFifth = regionDestinations.length === 5 && destIdx === 4;

            return (
              <article
                key={dest.id}
                data-testid={`destination-card-${dest.id}`}
                data-unlocked={destStats.unlocked ? 'true' : 'false'}
                data-completed={destStats.isCompleted ? 'true' : 'false'}
                className={`rounded-2xl overflow-hidden border flex flex-col transition-all duration-150 ${
                  isWideFifth ? 'md:col-span-2' : ''
                } ${
                  !destStats.unlocked
                    ? 'bg-[#191511] border-[#352A20]'
                    : destStats.isCompleted
                      ? 'bg-[#1C1913] border-[#5D4C34]'
                      : 'bg-[#1D1B16] border-[#4F3F2D]'
                }`}
              >
                {/* Destination Custom Local SVG Artwork */}
                <div className="relative">
                  <DestinationArtworkSvg destinationId={dest.id} locked={!destStats.unlocked} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181410] via-transparent to-transparent" />

                  <div className="absolute top-2.5 right-3 left-3 flex items-center justify-between gap-2 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-[#14110E]/85 text-[#F2CA70] tabular-nums">
                      مقصد {toPersianDigits(dest.order)} · مراحل {toPersianDigits(dest.levelIds[0])} و{' '}
                      {toPersianDigits(dest.levelIds[1])}
                    </span>

                    {destStats.isCompleted ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#0F3C3A]/90 text-[#7DF8C4] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>تکمیل</span>
                      </span>
                    ) : destStats.unlocked ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#142D36]/90 text-[#6CECF5] tabular-nums">
                        {toPersianDigits(destStats.completedCount)} از ۲
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-[#14110E]/85 text-[#BDA782] flex items-center gap-1">
                        <Lock className="w-3 h-3" aria-hidden="true" />
                        <span>قفل</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Destination Header + Accurate Persian Description */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3.5">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl sm:text-2xl text-[#FBF4E4]">
                        {dest.nameFa}
                      </h3>
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#E6BA5E] tabular-nums shrink-0">
                        <Star className="w-3.5 h-3.5 fill-[#E6BA5E]" aria-hidden="true" />
                        <span>
                          {toPersianDigits(destStats.earnedStars)}/{toPersianDigits(destStats.maxStars)}
                        </span>
                      </span>
                    </div>
                    <p
                      className="mt-0.5 text-xs font-medium"
                      style={{ color: destStats.unlocked ? dest.accentHex : '#9E8B70' }}
                    >
                      {dest.taglineFa}
                    </p>
                    <p className="mt-2 text-xs text-[#CBB896] leading-relaxed">
                      {dest.descriptionFa}
                    </p>
                  </div>

                  {/* Two Playable Level Cards belonging to this Destination */}
                  <div
                    className={`gap-2.5 pt-2 border-t border-[#32271D] ${
                      isWideFifth ? 'grid grid-cols-1 md:grid-cols-2' : 'flex flex-col'
                    }`}
                  >
                    {destLevels.map((level) => {
                      const record = progress.levels[level.id];
                      const isCompleted = Boolean(record?.completed);
                      const unlocked = isLevelUnlocked(progress, level.id);
                      const isCurrentPlayable =
                        unlocked && !isCompleted && level.id === campaignSummary.highestUnlockedLevelId;
                      const stars = record?.bestStars ?? 0;

                      return (
                        <button
                          key={level.id}
                          type="button"
                          data-testid={`level-card-${level.id}`}
                          data-unlocked={unlocked ? 'true' : 'false'}
                          data-completed={isCompleted ? 'true' : 'false'}
                          disabled={!unlocked}
                          onClick={() => onSelectLevel(level.id)}
                          className={`group text-right w-full min-h-[60px] p-3 rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] ${
                            !unlocked
                              ? 'bg-[#17130F] border-[#2E241C] opacity-70 cursor-not-allowed'
                              : isCurrentPlayable
                                ? 'bg-[#18292E] border-[#1FAEC0] hover:bg-[#1E3339] cursor-pointer active:scale-[0.99] shadow-[0_4px_16px_rgba(19,153,168,0.18)]'
                                : 'bg-[#211B15] border-[#4A3928] hover:bg-[#2A2219] hover:border-[#806342] cursor-pointer active:scale-[0.99]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`font-display text-xl leading-none tabular-nums shrink-0 ${
                                  unlocked ? 'text-[#E6BA5E]' : 'text-[#6E5D4B]'
                                }`}
                              >
                                {toPersianDigits(level.id)}
                              </span>
                              <span
                                className={`text-sm font-bold truncate ${
                                  unlocked ? 'text-[#FBF4E4]' : 'text-[#968470]'
                                }`}
                              >
                                {level.titleFa}
                              </span>
                            </div>

                            {unlocked ? (
                              <div
                                className="flex items-center gap-0.5 shrink-0"
                                aria-label={`${toPersianDigits(stars)} ستاره از ۳`}
                              >
                                {[1, 2, 3].map((idx) => (
                                  <Star
                                    key={idx}
                                    className={`w-3.5 h-3.5 ${
                                      idx <= stars
                                        ? 'text-[#E6BA5E] fill-[#E6BA5E]'
                                        : 'text-[#4B3C2E]'
                                    }`}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                            ) : (
                              <Lock className="w-4 h-4 text-[#7D6B57] shrink-0" aria-hidden="true" />
                            )}
                          </div>

                          <p
                            className={`mt-1 text-[11px] leading-relaxed ${
                              unlocked ? 'text-[#C6B392]' : 'text-[#8C7A65]'
                            }`}
                          >
                            {unlocked
                              ? level.subtitleFa
                              : `با تکمیل مرحله ${toPersianDigits(level.id - 1)} باز می‌شود`}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#B8A382] tabular-nums">
                            <div className="flex items-center gap-1.5">
                              <span>
                                {toPersianDigits(level.rows)}×{toPersianDigits(level.cols)}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{DIFFICULTY_LABELS_FA[level.difficulty]}</span>
                              <span aria-hidden="true">·</span>
                              <span>{toPersianDigits(level.expectedMinMoves)} حرکت</span>
                            </div>

                            {isCompleted ? (
                              <span className="flex items-center gap-1 text-[#5CE1EC] font-medium shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>
                                  {toPersianDigits(record.bestScore)} ·{' '}
                                  <span dir="ltr">{formatTimePersian(record.bestTimeSec)}</span>
                                </span>
                              </span>
                            ) : isCurrentPlayable ? (
                              <span className="flex items-center gap-1 text-[#F2BE4E] font-semibold shrink-0">
                                <Play className="w-3 h-3 fill-current" aria-hidden="true" />
                                <span>مرحله فعلی</span>
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
