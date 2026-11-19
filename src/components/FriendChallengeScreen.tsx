import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  Link2,
  Play,
  RefreshCw,
  Share2,
  Star,
  Users,
} from 'lucide-react';
import { DIFFICULTY_LABELS_FA } from '../campaign/regions';
import {
  buildFriendChallengeUrl,
  buildFriendShareTextFa,
  createFriendChallengeByDifficulty,
  parseFriendChallengeCode,
  type FriendChallengeParseResult,
} from '../engagement/friendChallenge';
import { copyChallengeLink, shareChallengeLink } from '../engagement/shareUtils';
import { formatTimePersian, toPersianDigits } from '../engine/scoring';
import type {
  Difficulty,
  FriendChallengeDefinition,
  SavedEngagementData,
} from '../engine/types';
import { LeaderboardPanel } from './LeaderboardPanel';

interface FriendChallengeScreenProps {
  activeChallenge: FriendChallengeDefinition;
  importedError: string | null;
  isFromLink: boolean;
  engagement: SavedEngagementData;
  onChangeChallenge: (challenge: FriendChallengeDefinition, isFromLink: boolean) => void;
  onClearImportError: () => void;
  onPlayChallenge: (challenge: FriendChallengeDefinition) => void;
  onBackHome: () => void;
}

const DIFFICULTY_OPTIONS: ReadonlyArray<{ id: Difficulty | 'any'; labelFa: string }> = [
  { id: 'any', labelFa: 'همه' },
  { id: 'normal', labelFa: 'معمولی' },
  { id: 'medium', labelFa: 'متوسط' },
  { id: 'challenging', labelFa: 'چالش‌برانگیز' },
  { id: 'hard', labelFa: 'سخت' },
  { id: 'expert', labelFa: 'استاد' },
];

export function FriendChallengeScreen({
  activeChallenge,
  importedError,
  isFromLink,
  engagement,
  onChangeChallenge,
  onClearImportError,
  onPlayChallenge,
  onBackHome,
}: FriendChallengeScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'any'>('any');
  const [shareFeedback, setShareFeedback] = useState<string>('');
  const [copiedRecently, setCopiedRecently] = useState<boolean>(false);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  const [manualError, setManualError] = useState<string>('');
  const [rollCounter, setRollCounter] = useState<number>(1);

  const shareUrl = buildFriendChallengeUrl(activeChallenge.challengeId);
  const existingRecord = engagement.friendRecords[activeChallenge.challengeId];

  const recentCompleted = Object.values(engagement.friendRecords)
    .filter((rec) => rec.completed)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 6);

  const handleGenerateNew = (diff: Difficulty | 'any' = selectedDifficulty) => {
    const nextCount = rollCounter + 1;
    setRollCounter(nextCount);
    const entropy = `${Date.now()}-${nextCount}-${Math.floor(Math.random() * 1_000_000)}`;
    const nextChallenge = createFriendChallengeByDifficulty(diff, entropy);
    onClearImportError();
    onChangeChallenge(nextChallenge, false);
    setShareFeedback('');
    setCopiedRecently(false);
    setManualError('');
  };

  const handleCopyLink = async () => {
    const outcome = await copyChallengeLink(shareUrl);
    setShareFeedback(outcome.messageFa);
    if (outcome.ok) {
      setCopiedRecently(true);
      window.setTimeout(() => setCopiedRecently(false), 2600);
    }
  };

  const handleShareLink = async () => {
    const outcome = await shareChallengeLink({
      title: `قنات‌چی — رقابت ${activeChallenge.titleFa}`,
      text: buildFriendShareTextFa(activeChallenge),
      url: shareUrl,
    });
    setShareFeedback(outcome.messageFa);
    if (outcome.ok && outcome.method !== 'web-share') {
      setCopiedRecently(true);
      window.setTimeout(() => setCopiedRecently(false), 2600);
    }
  };

  const handleLoadManualCode = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    setShareFeedback('');
    const raw = manualCodeInput.trim();

    let candidateCode = raw;
    if (raw.includes('challenge=')) {
      try {
        const maybeUrl = new URL(raw);
        candidateCode = maybeUrl.searchParams.get('challenge') ?? raw;
      } catch {
        const idx = raw.indexOf('challenge=');
        candidateCode = raw.slice(idx + 'challenge='.length).split('&')[0];
      }
    }

    const parsed: FriendChallengeParseResult = parseFriendChallengeCode(candidateCode);
    if (!parsed.ok) {
      setManualError(parsed.messageFa);
      return;
    }
    onClearImportError();
    onChangeChallenge(parsed.challenge, true);
    setManualCodeInput('');
  };

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-[#111922] via-[#15120F] to-[#120E0B] text-[#F5ECD7] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-[#463524] bg-[#17130F]/95">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            data-testid="friend-back-home"
            onClick={onBackHome}
            aria-label="بازگشت به صفحه اصلی"
            className="min-h-[44px] px-3 rounded-lg text-[#E6BA5E] hover:bg-[#2A2018] flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap shrink-0"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>صفحه اصلی</span>
          </button>

          <h1 className="font-display text-xl sm:text-2xl text-[#FBF4E4] truncate">
            رقابت با دوستان
          </h1>

          <div className="w-20 hidden sm:block" aria-hidden="true" />
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex flex-col gap-5">
        {/* Invalid / Unsupported Imported URL Error Card */}
        {importedError && (
          <section
            role="alert"
            data-testid="friend-import-error"
            className="rounded-2xl bg-[#2A1717] border border-[#8E3B3B] p-4 flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#F87171] mt-0.5 shrink-0" aria-hidden="true" />
              <div className="text-sm text-[#FAD2D2]">
                <p className="font-bold">لینک رقابت قابل بارگذاری نبود</p>
                <p className="mt-1 text-xs sm:text-sm text-[#EABABA]">{importedError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClearImportError}
              className="min-h-[40px] px-3 rounded-lg text-xs text-[#F5C2C2] hover:bg-[#3E2020] cursor-pointer shrink-0"
            >
              بستن
            </button>
          </section>
        )}

        {/* Active Challenge Card */}
        <section
          aria-labelledby="friend-active-title"
          className="rounded-2xl bg-[#1D1712] border border-[#4D3B28] overflow-hidden"
        >
          <div className="px-5 sm:px-6 py-4 border-b border-[#362A1E] bg-gradient-to-l from-[#182E38] via-[#1E2224] to-[#241C14] flex items-center justify-between gap-3 flex-wrap">
            <div>
              <span className="text-xs text-[#8ADCE5] font-medium block">
                {isFromLink ? 'رقابت دریافت‌شده از لینک دوست' : 'معمای آماده اشتراک‌گذاری'}
              </span>
              <h2
                id="friend-active-title"
                data-testid="friend-challenge-title"
                className="font-display text-2xl sm:text-3xl text-[#FBF4E4] mt-0.5"
              >
                {activeChallenge.titleFa}
              </h2>
            </div>

            <div className="text-left" dir="ltr">
              <span className="block text-[11px] text-[#B8A485]">کد یکتای رقابت</span>
              <span
                data-testid="friend-challenge-id"
                className="font-mono text-xs sm:text-sm font-bold text-[#F2BE4E] tracking-wide"
              >
                {activeChallenge.challengeId}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-4">
            <p className="text-sm text-[#D7C6AA] leading-relaxed">{activeChallenge.introFa}</p>

            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#CBB896] tabular-nums">
              <span>درجه سختی: {DIFFICULTY_LABELS_FA[activeChallenge.difficulty]}</span>
              <span>
                ابعاد صفحه: {toPersianDigits(activeChallenge.level.rows)}×
                {toPersianDigits(activeChallenge.level.cols)}
              </span>
              <span>حداقل حرکت: {toPersianDigits(activeChallenge.level.expectedMinMoves)}</span>
            </div>

            {/* Local Record for this Challenge if already played */}
            {existingRecord && existingRecord.completed && (
              <div
                data-testid="friend-local-record"
                className="rounded-xl bg-[#152529] border border-[#246672] p-3.5 flex items-center justify-between gap-3 flex-wrap tabular-nums"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx <= existingRecord.bestStars
                            ? 'text-[#F2BE4E] fill-[#F2BE4E]'
                            : 'text-[#364B52]'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#FBF4E4]">
                    رکورد شما: {toPersianDigits(existingRecord.bestScore)} امتیاز ({existingRecord.performanceLabelFa})
                  </span>
                </div>
                <span className="text-xs text-[#9CD3DA]">
                  {toPersianDigits(existingRecord.bestMoves)} چرخش ·{' '}
                  <span dir="ltr">{formatTimePersian(existingRecord.bestTimeSec)}</span>
                </span>
              </div>
            )}

            {/* Shareable URL Box */}
            <div className="rounded-xl bg-[#15110D] border border-[#3B2E22] p-3 flex flex-col gap-2">
              <span className="text-[11px] text-[#B59F7E] flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#5BE8F5]" aria-hidden="true" />
                <span>لینک مستقیم این معما (چیدمان کاملاً یکسان برای هر دو بازیکن)</span>
              </span>
              <input
                type="text"
                readOnly
                dir="ltr"
                aria-label="آدرس اشتراک‌گذاری رقابت دوستانه"
                data-testid="friend-share-url"
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#E8DCC5] focus:outline-none truncate"
              />
            </div>

            {/* Share / Copy / Play Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                data-testid="btn-play-friend-challenge"
                onClick={() => onPlayChallenge(activeChallenge)}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#D99B26] hover:bg-[#E5AA36] active:scale-[0.98] text-[#1A130C] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF4E4] whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current shrink-0" aria-hidden="true" />
                <span>{existingRecord?.completed ? 'تکرار این معما' : 'بازی کردن این معما'}</span>
              </button>

              <button
                type="button"
                data-testid="btn-share-friend-link"
                onClick={handleShareLink}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#137C8A] hover:bg-[#1793A3] active:scale-[0.98] text-[#F4FEFF] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5BE8F5] whitespace-nowrap"
              >
                <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>اشتراک‌گذاری لینک</span>
              </button>

              <button
                type="button"
                data-testid="btn-copy-friend-link"
                onClick={handleCopyLink}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#271F17] hover:bg-[#34291E] border border-[#644E36] text-[#F5ECD7] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6BA5E] whitespace-nowrap"
              >
                {copiedRecently ? (
                  <Check className="w-4 h-4 text-[#7DF8C4] shrink-0" aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4 text-[#E6BA5E] shrink-0" aria-hidden="true" />
                )}
                <span>{copiedRecently ? 'کپی شد' : 'کپی لینک'}</span>
              </button>
            </div>

            {shareFeedback && (
              <p
                role="status"
                aria-live="polite"
                data-testid="friend-share-feedback"
                className="text-xs sm:text-sm text-[#7DF8C4] font-medium"
              >
                {shareFeedback}
              </p>
            )}
          </div>
        </section>

        {/* Generate New Challenge by Difficulty */}
        <section className="rounded-2xl bg-[#1D1712] border border-[#3E3022] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="font-semibold text-sm sm:text-base text-[#FBF4E4]">
              ساخت رقابت جدید با سطح دلخواه
            </h3>
            <button
              type="button"
              data-testid="btn-generate-new-challenge"
              onClick={() => handleGenerateNew(selectedDifficulty)}
              className="min-h-[44px] px-4 rounded-xl bg-[#292018] hover:bg-[#362A1F] border border-[#6B5237] text-[#F2CA70] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>ساخت معمای جدید</span>
            </button>
          </div>

          <div
            role="group"
            aria-label="انتخاب سطح سختی رقابت دوستانه"
            className="flex flex-wrap gap-1.5"
          >
            {DIFFICULTY_OPTIONS.map((opt) => {
              const active = selectedDifficulty === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedDifficulty(opt.id);
                    handleGenerateNew(opt.id);
                  }}
                  className={`min-h-[40px] px-3.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#D99B26] text-[#1A130C] font-bold'
                      : 'bg-[#261E16] text-[#D2C0A4] hover:bg-[#32271D]'
                  }`}
                >
                  {opt.labelFa}
                </button>
              );
            })}
          </div>
        </section>

        {/* Load Friend Challenge by Code or URL */}
        <section className="rounded-2xl bg-[#1D1712] border border-[#3E3022] p-5 flex flex-col gap-3">
          <h3 className="font-semibold text-sm sm:text-base text-[#FBF4E4]">
            ورود کد یا لینک رقابت دوست
          </h3>
          <form onSubmit={handleLoadManualCode} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              dir="ltr"
              value={manualCodeInput}
              onChange={(e) => {
                setManualCodeInput(e.target.value);
                setManualError('');
              }}
              placeholder="Q1-04-9A3F1C2B-E4"
              aria-label="کد یا لینک رقابت دوست"
              data-testid="input-manual-challenge-code"
              className="flex-1 min-h-[46px] px-3.5 rounded-xl bg-[#14100C] border border-[#4A3A2A] text-sm font-mono text-[#FBF4E4] placeholder:text-[#7E6B53] focus:outline-none focus:ring-2 focus:ring-[#5BE8F5]"
            />
            <button
              type="submit"
              data-testid="btn-load-manual-challenge"
              className="min-h-[46px] px-5 rounded-xl bg-[#27383E] hover:bg-[#31474F] border border-[#3E6A75] text-[#E6FAFC] font-semibold text-sm cursor-pointer whitespace-nowrap"
            >
              بارگذاری معما
            </button>
          </form>
          {manualError && (
            <p role="alert" data-testid="manual-code-error" className="text-xs sm:text-sm text-[#FCA5A5]">
              {manualError}
            </p>
          )}
        </section>

        {/* Global Server Leaderboard for this Friend Challenge (distinct from local history) */}
        <LeaderboardPanel
          mode="friend"
          challengeId={activeChallenge.challengeId}
          titleFa="جدول امتیازات جهانی این رقابت"
        />

        {/* Local History of Completed Friend Challenges */}
        <section className="rounded-2xl bg-[#1D1712] border border-[#3E3022] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm sm:text-base text-[#FBF4E4] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5BE8F5]" aria-hidden="true" />
              <span>رقابت‌های حل‌شده روی این دستگاه</span>
            </h3>
            <span className="text-xs text-[#B59F7E] tabular-nums">
              {toPersianDigits(recentCompleted.length)} مورد اخیر
            </span>
          </div>

          {recentCompleted.length === 0 ? (
            <p className="text-xs sm:text-sm text-[#A89375] py-2">
              هنوز هیچ رقابت دوستانه‌ای را به پایان نرسانده‌اید. لینک بالا را برای دوستتان بفرستید و همین معما را حل کنید.
            </p>
          ) : (
            <div className="divide-y divide-[#33271D]">
              {recentCompleted.map((rec) => (
                <div
                  key={rec.challengeId}
                  className="py-3 flex items-center justify-between gap-3 flex-wrap"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#FBF4E4]">{rec.titleFa}</p>
                    <p className="text-xs text-[#B59F7E] mt-0.5 tabular-nums">
                      <span dir="ltr" className="font-mono text-[#D6B67A]">
                        {rec.challengeId}
                      </span>{' '}
                      · {toPersianDigits(rec.bestScore)} امتیاز ·{' '}
                      {toPersianDigits(rec.bestMoves)} چرخش ·{' '}
                      <span dir="ltr">{formatTimePersian(rec.bestTimeSec)}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const parsed = parseFriendChallengeCode(rec.challengeId);
                      if (parsed.ok) {
                        onChangeChallenge(parsed.challenge, false);
                        onPlayChallenge(parsed.challenge);
                      }
                    }}
                    className="min-h-[40px] px-3.5 rounded-lg bg-[#292018] hover:bg-[#362A1F] border border-[#5A4530] text-[#E6BA5E] text-xs font-semibold cursor-pointer whitespace-nowrap"
                  >
                    تکرار
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-[#9D896C] pt-1 leading-relaxed">
            نکته: هر بازیکن معمای یکسان را به صورت مستقل و آفلاین حل می‌کند. رکوردها صرفاً روی دستگاه خودتان ذخیره می‌شوند و بدون نیاز به حساب کاربری می‌توانید امتیازتان را با دوستان مقایسه کنید.
          </p>
        </section>
      </main>
    </div>
  );
}
