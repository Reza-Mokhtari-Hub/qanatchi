import { Compass, Sparkles, Trophy } from 'lucide-react';
import type { StoryMoment } from '../engine/types';

interface StoryCelebrationModalProps {
  moment: StoryMoment;
  animationsEnabled?: boolean;
  onContinue: () => void;
}

/**
 * Lightweight, respectful Persian narrative & milestone celebration overlay.
 * Appears only on genuine first-time campaign milestones and dismisses in one tap.
 */
export function StoryCelebrationModal({
  moment,
  animationsEnabled = true,
  onContinue,
}: StoryCelebrationModalProps) {
  const isCampaignEnd = moment.kind === 'campaign_complete';
  const isRegionUnlock = moment.kind === 'region_unlocked';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-moment-title"
      data-testid="story-modal"
      data-story-id={moment.id}
      className="fixed inset-0 z-50 bg-[#080F16]/82 flex items-center justify-center p-4"
    >
      <div
        className={`w-full max-w-md rounded-2xl bg-gradient-to-b from-[#162730] via-[#1B1713] to-[#17130F] border border-[#E6BA5E]/75 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.72)] text-center ${
          animationsEnabled ? 'animate-qanat-modal' : ''
        }`}
      >
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#12333F] border border-[#29B0C1]/75 flex items-center justify-center mb-4 shadow-[0_8px_22px_rgba(20,184,201,0.22)]">
          {isCampaignEnd ? (
            <Trophy className="w-7 h-7 text-[#F2C96B]" aria-hidden="true" />
          ) : isRegionUnlock ? (
            <Compass className="w-7 h-7 text-[#6CECF5]" aria-hidden="true" />
          ) : (
            <Sparkles className="w-7 h-7 text-[#F2C96B]" aria-hidden="true" />
          )}
        </div>

        <h2
          id="story-moment-title"
          className="font-display text-2xl sm:text-3xl text-[#FBF4E4] leading-snug"
        >
          {moment.titleFa}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-[#DED0B6] leading-relaxed">
          {moment.bodyFa}
        </p>

        <button
          type="button"
          data-testid="story-modal-cta"
          onClick={onContinue}
          className="mt-6 w-full min-h-[48px] px-5 rounded-xl bg-[#D99B26] hover:bg-[#E7AC3B] active:scale-[0.98] text-[#17110A] font-bold text-base transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4]"
        >
          {moment.ctaFa}
        </button>
      </div>
    </div>
  );
}
