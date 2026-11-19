import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CloudOff,
  Database,
  RefreshCw,
  Star,
  Trophy,
} from 'lucide-react';
import {
  fetchDailyLeaderboard,
  fetchFriendLeaderboard,
  getOrCreateAnonymousPlayerId,
  type LeaderboardFetchResult,
} from '../api/edgeClient';
import { toPersianDigits } from '../engine/scoring';

interface LeaderboardPanelProps {
  mode: 'daily' | 'friend';
  dateKey?: string;
  challengeId: string;
  titleFa: string;
}

const PAGE_SIZE = 10;

export function LeaderboardPanel({
  mode,
  dateKey,
  challengeId,
  titleFa,
}: LeaderboardPanelProps) {
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<LeaderboardFetchResult | null>(null);
  const mountedRef = useRef<boolean>(true);
  const requestSeqRef = useRef<number>(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadLeaderboard = useCallback(
    async (nextOffset: number) => {
      const seq = ++requestSeqRef.current;
      setLoading(true);
      const playerId = getOrCreateAnonymousPlayerId();
      const res =
        mode === 'daily' && dateKey
          ? await fetchDailyLeaderboard(dateKey, {
              limit: PAGE_SIZE,
              offset: nextOffset,
              playerId,
            })
          : await fetchFriendLeaderboard(challengeId, {
              limit: PAGE_SIZE,
              offset: nextOffset,
              playerId,
            });
      if (!mountedRef.current || seq !== requestSeqRef.current) {
        return;
      }
      setResult(res);
      setLoading(false);
    },
    [challengeId, dateKey, mode],
  );

  useEffect(() => {
    setOffset(0);
    void loadLeaderboard(0);
  }, [loadLeaderboard]);

  const handlePrev = () => {
    const prevOffset = Math.max(0, offset - PAGE_SIZE);
    setOffset(prevOffset);
    void loadLeaderboard(prevOffset);
  };

  const handleNext = () => {
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    void loadLeaderboard(nextOffset);
  };

  return (
    <section
      aria-labelledby="global-leaderboard-heading"
      data-testid="global-leaderboard-panel"
      className="rounded-2xl bg-[#1D1712] border border-[#3E3022] p-5 flex flex-col gap-3.5"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3
            id="global-leaderboard-heading"
            className="font-semibold text-sm sm:text-base text-[#FBF4E4] flex items-center gap-2"
          >
            <Trophy className="w-4 h-4 text-[#E6BA5E] shrink-0" aria-hidden="true" />
            <span>{titleFa}</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-[#A89375] mt-0.5">
            رتبه‌بندی صرفاً از رکوردهای تأییدشده و ذخیره‌شده در سرور نمایش داده می‌شود (جدا از رکوردهای محلی).
          </p>
        </div>

        <button
          type="button"
          data-testid="btn-retry-leaderboard"
          onClick={() => void loadLeaderboard(offset)}
          disabled={loading}
          className="min-h-[40px] px-3.5 rounded-xl bg-[#271F17] hover:bg-[#34291E] disabled:opacity-50 border border-[#5A4530] text-[#E6BA5E] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 shrink-0 ${loading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          <span>تلاش مجدد</span>
        </button>
      </div>

      {loading ? (
        <div
          data-testid="leaderboard-loading"
          className="py-5 text-center text-xs sm:text-sm text-[#BBA788]"
        >
          در حال دریافت جدول امتیازات جهانی از سرور لبه...
        </div>
      ) : result?.status === 'storage_not_configured' ? (
        <div
          data-testid="leaderboard-storage-unconfigured"
          className="rounded-xl bg-[#161E22] border border-[#2C5560] p-4 flex items-start gap-3"
        >
          <Database className="w-5 h-5 text-[#6CECF5] mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-xs sm:text-sm text-[#CBEFF2] leading-relaxed">
            <p className="font-semibold text-[#FBF4E4]">
              جدول امتیازات جهانی در انتظار اتصال به پایگاه‌داده پایدار است
            </p>
            <p className="mt-1 text-[#A9CFD6]">{result.messageFa}</p>
          </div>
        </div>
      ) : result?.status === 'offline' || result?.status === 'error' ? (
        <div
          data-testid="leaderboard-offline"
          className="rounded-xl bg-[#241B14] border border-[#6E4D2C] p-4 flex items-start gap-3"
        >
          <CloudOff className="w-5 h-5 text-[#F2BE4E] mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-xs sm:text-sm text-[#EED9B8] leading-relaxed">
            <p className="font-semibold text-[#FBF4E4]">
              سرور جدول امتیازات در دسترس نیست
            </p>
            <p className="mt-1 text-[#CBB896]">{result.messageFa}</p>
          </div>
        </div>
      ) : result?.status === 'ok' ? (
        result.data.entries.length === 0 ? (
          <div
            data-testid="leaderboard-empty"
            className="rounded-xl bg-[#17120E] border border-[#35291E] p-4 text-xs sm:text-sm text-[#B8A485] text-center"
          >
            هنوز هیچ رکورد تأییدشده‌ای برای این چالش در سرور ثبت نشده است.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="overflow-x-auto">
              <table
                data-testid="leaderboard-table"
                className="w-full text-right text-xs sm:text-sm tabular-nums border-collapse"
              >
                <thead>
                  <tr className="border-b border-[#35291E] text-[#A89375] text-[11px] sm:text-xs">
                    <th className="py-2 px-2 font-medium">رتبه</th>
                    <th className="py-2 px-2 font-medium">بازیکن</th>
                    <th className="py-2 px-2 font-medium">امتیاز سرور</th>
                    <th className="py-2 px-2 font-medium">حرکت</th>
                    <th className="py-2 px-2 font-medium">ستاره</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2219]">
                  {result.data.entries.map((entry) => (
                    <tr key={entry.submissionId} className="text-[#F5ECD7]">
                      <td className="py-2.5 px-2 font-bold text-[#F2BE4E]">
                        {toPersianDigits(entry.rank)}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="font-medium block truncate max-w-[140px]">
                          {entry.displayLabel}
                        </span>
                        <span className="text-[11px] text-[#9E8A6E]">
                          {entry.performanceLabelFa}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-bold text-[#6CECF5]">
                        {toPersianDigits(entry.score)}
                      </td>
                      <td className="py-2.5 px-2">{toPersianDigits(entry.verifiedMoves)}</td>
                      <td className="py-2.5 px-2">
                        <span className="inline-flex items-center gap-0.5">
                          <Star
                            className="w-3.5 h-3.5 text-[#F2BE4E] fill-[#F2BE4E]"
                            aria-hidden="true"
                          />
                          <span>{toPersianDigits(entry.stars)}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(offset > 0 || result.data.hasMore) && (
              <div className="flex items-center justify-between pt-2 border-t border-[#33271D]">
                <button
                  type="button"
                  disabled={offset === 0 || loading}
                  onClick={handlePrev}
                  className="min-h-[40px] px-3 rounded-lg bg-[#271F17] hover:bg-[#34291E] disabled:opacity-40 text-xs text-[#E6BA5E] flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  <span>صفحه قبل</span>
                </button>
                <span className="text-xs text-[#A89375] tabular-nums">
                  مجموع رکوردها: {toPersianDigits(result.data.total)}
                </span>
                <button
                  type="button"
                  disabled={!result.data.hasMore || loading}
                  onClick={handleNext}
                  className="min-h-[40px] px-3 rounded-lg bg-[#271F17] hover:bg-[#34291E] disabled:opacity-40 text-xs text-[#E6BA5E] flex items-center gap-1 cursor-pointer"
                >
                  <span>صفحه بعد</span>
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )
      ) : null}
    </section>
  );
}
