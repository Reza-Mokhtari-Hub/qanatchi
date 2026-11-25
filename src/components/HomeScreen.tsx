import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Grid2X2,
  Map,
  Play,
  RotateCw,
  Settings,
  Users,
} from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';
import { getDestinationForLevelId } from '../campaign/destinations';
import { getCampaignSummary, getRecommendedPlayableLevelId } from '../campaign/progression';
import { getEffectiveStreak } from '../engagement/dailyStreak';
import { toPersianDigits } from '../engine/scoring';
import type { SavedEngagementData, SavedProgress } from '../engine/types';
import { QanatchiLogo } from './QanatchiLogo';

interface HomeScreenProps {
  progress: SavedProgress;
  engagement: SavedEngagementData;
  todayTehranKey: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  onStartAdventure: () => void;
  onContinueGame: () => void;
  onOpenMap: () => void;
  onOpenLevels: () => void;
  onOpenDaily: () => void;
  onOpenFriend: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
const TITLE_BG_PATH = `${BASE_URL}/src/assets/images/title_bg_1795103644385.jpg`;

export function HomeScreen({
  progress,
  engagement,
  todayTehranKey,
  soundEnabled,
  animationsEnabled,
  onStartAdventure,
  onContinueGame,
  onOpenMap,
  onOpenLevels,
  onOpenDaily,
  onOpenFriend,
  onOpenStats,
  onOpenSettings,
}: HomeScreenProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const summary = getCampaignSummary(progress);
  const continueLevelNum = getRecommendedPlayableLevelId(progress);
  const continueDestination = getDestinationForLevelId(continueLevelNum);
  const streakView = getEffectiveStreak(engagement.streak, todayTehranKey);

  const withTapSound = (fn: () => void) => () => {
    soundEngine.playButtonClick(soundEnabled);
    fn();
  };

  return (
    <main className="relative min-h-dvh w-full overflow-hidden flex flex-col justify-between bg-[#0E161E]">
      {/* Illustrated Desert Qanat Twilight Backdrop with Graceful Fallback */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {!imgFailed ? (
          <img
            src={TITLE_BG_PATH}
            alt="منظره کویر یزد و قنات باستانی در گرگ‌ومیش"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover object-center scale-[1.01]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#0E1E2E] via-[#271F17] to-[#13100D]" />
        )}

        {/* Measured Persian midnight-lapis & warm sand vignette scrim for WCAG AA contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1724]/86 via-[#14171B]/60 to-[#110D0A]/94" />

        {/* Subtle Persian Girih architectural corner lattice (non-obstructive, zero visual clutter) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.14]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="home-persian-girih"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M32 4 L60 32 L32 60 L4 32 Z"
                fill="none"
                stroke="#E6BA5E"
                strokeWidth="0.7"
              />
              <circle cx="32" cy="32" r="4" fill="none" stroke="#39DCEB" strokeWidth="0.7" />
            </pattern>
            <radialGradient id="home-girih-mask" cx="50%" cy="46%" r="58%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="68%" stopColor="white" stopOpacity="0.18" />
              <stop offset="100%" stopColor="white" stopOpacity="0.9" />
            </radialGradient>
            <mask id="home-edge-mask">
              <rect width="100%" height="100%" fill="url(#home-girih-mask)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#home-persian-girih)"
            mask="url(#home-edge-mask)"
          />
        </svg>

        {/* Delicate Persian architectural inset hairline frame on wider viewports */}
        <div className="hidden sm:block absolute inset-4 rounded-3xl border border-[#E6BA5E]/14 pointer-events-none" />
      </div>

      {/* Main Content Centered Over Calm Negative Space */}
      <div
        className={`relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-9 max-w-xl mx-auto w-full ${
          animationsEnabled ? 'animate-qanat-enter' : ''
        }`}
      >
        <QanatchiLogo animationsEnabled={animationsEnabled} />

        {/* Quiet Unboxed Progress Summary */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm font-medium text-[#F5E7CC] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] tabular-nums">
          <span data-testid="home-campaign-progress">
            مراحل تکمیل‌شده: {toPersianDigits(summary.completedLevels)} از{' '}
            {toPersianDigits(summary.totalLevels)}
          </span>
          <span aria-hidden="true" className="text-[#E6BA5E]/75">
            ·
          </span>
          <span>
            ستاره‌ها: {toPersianDigits(summary.earnedStars)} از {toPersianDigits(summary.maxStars)}
          </span>
          {streakView.currentStreak > 0 && (
            <>
              <span aria-hidden="true" className="text-[#E6BA5E]/75">
                ·
              </span>
              <span className="text-[#7DF8C4] font-semibold">
                زنجیره روزانه: {toPersianDigits(streakView.currentStreak)} روز
              </span>
            </>
          )}
        </div>

        {/* Clean, Balanced Mobile-First Navigation Menu */}
        <nav
          aria-label="منوی اصلی بازی"
          className="mt-6 w-full max-w-sm flex flex-col gap-2.5"
        >
          {/* Primary Focal CTA: Start Adventure */}
          <button
            type="button"
            data-start="true"
            onClick={withTapSound(onStartAdventure)}
            className="w-full min-h-[52px] px-6 py-3 rounded-xl bg-[#D99B26] hover:bg-[#E7AC3B] active:scale-[0.98] text-[#17110A] font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 border border-[#F8D88A]/60 shadow-[0_10px_28px_rgba(217,155,38,0.34),inset_0_1px_0_rgba(255,246,214,0.45)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12100E] whitespace-nowrap"
          >
            <Play className="w-5 h-5 fill-current shrink-0" aria-hidden="true" />
            <span>شروع ماجراجویی</span>
          </button>

          {/* Continue Current Campaign Level */}
          <button
            type="button"
            data-testid="btn-continue"
            onClick={withTapSound(onContinueGame)}
            className="w-full min-h-[48px] px-5 py-2.5 rounded-xl bg-[#1D1712]/92 hover:bg-[#292018] active:scale-[0.98] text-[#FBF4E4] border border-[#8A6A42]/65 hover:border-[#D99B26]/80 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap"
          >
            <RotateCw className="w-4 h-4 text-[#F2C96B] shrink-0" aria-hidden="true" />
            <span className="truncate">
              ادامه بازی · {continueDestination.nameFa} (مرحله {toPersianDigits(continueLevelNum)})
            </span>
          </button>

          {/* Campaign Map & Daily Challenge Row (Persian Turquoise Lapis Surfaces) */}
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <button
              type="button"
              data-testid="btn-open-map"
              onClick={withTapSound(onOpenMap)}
              className="min-h-[48px] px-3.5 py-2.5 rounded-xl bg-[#113140]/92 hover:bg-[#174356] active:scale-[0.98] text-[#ECFCFE] border border-[#249CAE]/70 hover:border-[#5BE8F5]/85 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_6px_16px_rgba(9,32,44,0.45)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5] whitespace-nowrap"
            >
              <Map className="w-4 h-4 text-[#69F0FB] shrink-0" aria-hidden="true" />
              <span>نقشه مناطق</span>
            </button>

            <button
              type="button"
              data-testid="btn-open-daily"
              onClick={withTapSound(onOpenDaily)}
              className="min-h-[48px] px-3.5 py-2.5 rounded-xl bg-[#113140]/92 hover:bg-[#174356] active:scale-[0.98] text-[#ECFCFE] border border-[#249CAE]/70 hover:border-[#5BE8F5]/85 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_6px_16px_rgba(9,32,44,0.45)] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5] whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-[#F2C96B] shrink-0" aria-hidden="true" />
              <span>چالش روزانه</span>
            </button>
          </div>

          {/* Friend Challenge & Level Selection Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              data-testid="btn-open-friend"
              onClick={withTapSound(onOpenFriend)}
              className="min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#1E1813]/90 hover:bg-[#2A2119] active:scale-[0.98] text-[#F5ECD7] border border-[#775D3E]/55 hover:border-[#B58C55]/75 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap"
            >
              <Users className="w-4 h-4 text-[#69F0FB] shrink-0" aria-hidden="true" />
              <span>رقابت با دوستان</span>
            </button>

            <button
              type="button"
              onClick={withTapSound(onOpenLevels)}
              className="min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#1E1813]/90 hover:bg-[#2A2119] active:scale-[0.98] text-[#F5ECD7] border border-[#775D3E]/55 hover:border-[#B58C55]/75 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap"
            >
              <Grid2X2 className="w-4 h-4 text-[#E6BA5E] shrink-0" aria-hidden="true" />
              <span>انتخاب مرحله</span>
            </button>
          </div>

          {/* Personal Statistics & Settings Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              data-testid="btn-open-stats"
              onClick={withTapSound(onOpenStats)}
              className="min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#1E1813]/90 hover:bg-[#2A2119] active:scale-[0.98] text-[#F5ECD7] border border-[#775D3E]/55 hover:border-[#B58C55]/75 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap"
            >
              <BarChart3 className="w-4 h-4 text-[#E6BA5E] shrink-0" aria-hidden="true" />
              <span>آمار من</span>
            </button>

            <button
              type="button"
              onClick={withTapSound(onOpenSettings)}
              className="min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#1E1813]/90 hover:bg-[#2A2119] active:scale-[0.98] text-[#F5ECD7] border border-[#775D3E]/55 hover:border-[#B58C55]/75 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap"
            >
              <Settings className="w-4 h-4 text-[#E6BA5E] shrink-0" aria-hidden="true" />
              <span>تنظیمات</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Quiet Single-Line Control Hint in Safe Bottom Margin */}
      <div className="relative z-10 pb-4 px-4 text-center">
        <p className="text-xs text-[#D5C2A2]/80">
          ۱۲ مسیر و ۵۰ مقصد در سراسر ایران · لوله‌ها را بچرخانید و آب را بدون نشت به مقصد برسانید
        </p>
      </div>
    </main>
  );
}
