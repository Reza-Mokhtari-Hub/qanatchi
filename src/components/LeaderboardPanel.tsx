import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CloudOff,
  Database,
  Globe,
  RefreshCw,
  Send,
  Star,
  Trophy,
} from 'lucide-react';
import {
  fetchDailyLeaderboard,
  fetchFriendLeaderboard,
  fetchGlobalLeaderboard,
  getOrCreateAnonymousPlayerId,
  submitVerifiedScoreToLeaderboard,
  type GlobalLeaderboardFetchResult,
  type LeaderboardFetchResult,
} from '../api/edgeClient';
import { toPersianDigits } from '../engine/scoring';
import {
  listUnsentSubmissions,
  removeUnsentSubmission,
} from '../storage/submissionQueue';

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
  const [scope, setScope] = useState<'challenge' | 'global'>('challenge');
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<LeaderboardFetchResult | null>(null);
  const [globalResult, setGlobalResult] = useState<GlobalLeaderboardFetchResult | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(() => listUnsentSubmissions().length);
  const [syncingQueue, setSyncingQueue] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  const requestSeqRef = useRef<number>(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadLeaderboard = useCallback(
    async (nextOffset: number, nextScope: 'challenge' | 'global' = scope) => {
      const seq = ++requestSeqRef.current;
      setLoading(true);
      const playerId = getOrCreateAnonymousPlayerId();
      if (nextScope === 'global') {
        const res = await fetchGlobalLeaderboard({
          limit: PAGE_SIZE,
          offset: nextOffset,
          playerId,
        });
        if (!mountedRef.current || seq !== requestSeqRef.current) return;
        setGlobalResult(res);
        setLoading(false);
        return;
      }

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
    [challengeId, dateKey, mode, scope],
  );

  useEffect(() => {
    setOffset(0);
    setPendingCount(listUnsentSubmissions().length);
    void loadLeaderboard(0, scope);
  }, [loadLeaderboard, scope]);

  const handleFlushQueue = async () => {
    const items = listUnsentSubmissions();
    if (items.length === 0 || syncingQueue) return;
    setSyncingQueue(true);
    for (const item of items) {
      const res = await submitVerifiedScoreToLeaderboard({
        challengeType: item.challengeType,
        challengeId: item.challengeId,
        dateKey: item.dateKey,
        levelId: item.levelId,
        algoVersion: item.algoVersion,
        actions: item.actions,
        playerId: item.playerId,
        displayLabel: item.displayLabel,
        attemptToken: item.attemptToken,
        idempotencyKey: item.idempotencyKey,
      });
      if (res.status === 'submitted' || res.status === 'error') {
        removeUnsentSubmission(item.idempotencyKey);
      } else if (res.status === 'offline') {
        break;
      }
    }
    if (!mountedRef.current) return;
    setPendingCount(listUnsentSubmissions().length);
    setSyncingQueue(false);
    void loadLeaderboard(offset, scope);
  };

  const handlePrev = () => {
    const prevOffset = Math.max(0, offset - PAGE_SIZE);
    setOffset(prevOffset);
    void loadLeaderboard(prevOffset, scope);
  };

  const handleNext = () => {
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    void loadLeaderboard(nextOffset, scope);
  };

  const activeStatus = scope === 'global' ? globalResult : result;

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
            {scope === 'global' ? (
              <Globe className="w-4 h-4 text-[#5BE8F5] shrink-0" aria-hidden="true" />
            ) : (
              <Trophy className="w-4 h-4 text-[#E6BA5E] shrink-0" aria-hidden="true" />
            )}
            <span>{scope === 'global' ? 'برترین قنات‌سازان جهان (مجموع امتیازات)' : titleFa}</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-[#A89375] mt-0.5">
            رتبه‌بندی صرفاً از رکوردهای تأییدشده و ذخیره‌شده در سرور نمایش داده می‌شود (جدا از رکوردهای محلی).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div
            role="tablist"
            aria-label="بخش جدول امتیازات"
            className="inline-flex rounded-xl bg-[#14100C] border border-[#3A2D21] p-0.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={scope === 'challenge'}
              data-testid="tab-leaderboard-challenge"
              onClick={() => setScope('challenge')}
              className={`min-h-[34px] px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                scope === 'challenge'
                  ? 'bg-[#D99B26] text-[#1A130C] font-bold'
                  : 'text-[#CBB896] hover:text-[#FBF4E4]'
              }`}
            >
              این چالش
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={scope === 'global'}
              data-testid="tab-leaderboard-global"
              onClick={() => setScope('global')}
              className={`min-h-[34px] px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                scope === 'global'
                  ? 'bg-[#137C8A] text-[#F4FEFF] font-bold'
                  : 'text-[#CBB896] hover:text-[#FBF4E4]'
              }`}
            >
              رده‌بندی جهانی
            </button>
          </div>

          <button
            type="button"
            data-testid="btn-retry-leaderboard"
            onClick={() => void loadLeaderboard(offset, scope)}
            disabled={loading}
            className="min-h-[36px] px-3 rounded-xl bg-[#271F17] hover:bg-[#34291E] disabled:opacity-50 border border-[#5A4530] text-[#E6BA5E] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 shrink-0 ${loading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>بروزرسانی</span>
          </button>
        </div>
      </div>

      {pendingCount > 0 && (
        <div
          data-testid="queued-submissions-banner"
          className="rounded-xl bg-[#221A12] border border-[#6E4D2C] px-3.5 py-2.5 flex items-center justify-between gap-2 flex-wrap text-xs"
        >
          <span className="text-[#F2CA70]">
            {toPersianDigits(pendingCount)} رکورد آفلاین در صف ارسال به سرور لبه منتظر است.
          </span>
          <button
            type="button"
            data-testid="btn-flush-queued-submissions"
            onClick={() => void handleFlushQueue()}
            disabled={syncingQueue}
            className="min-h-[34px] px-3 rounded-lg bg-[#D99B26] hover:bg-[#E5AA36] disabled:opacity-50 text-[#1A130C] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{syncingQueue ? 'در حال ارسال...' : 'ارسال رکوردهای معوق'}</span>
          </button>
        </div>
      )}

      {loading ? (
        <div
          data-testid="leaderboard-loading"
          className="py-5 text-center text-xs sm:text-sm text-[#BBA788]"
        >
          در حال دریافت جدول امتیازات جهانی از سرور لبه...
        </div>
      ) : activeStatus?.status === 'storage_not_configured' ? (
        <div
          data-testid="leaderboard-storage-unconfigured"
          className="rounded-xl bg-[#161E22] border border-[#2C5560] p-4 flex items-start gap-3"
        >
          <Database className="w-5 h-5 text-[#6CECF5] mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-xs sm:text-sm text-[#CBEFF2] leading-relaxed">
            <p className="font-semibold text-[#FBF4E4]">
              جدول امتیازات جهانی در انتظار اتصال به پایگاه‌داده پایدار است
            </p>
            <p className="mt-1 text-[#A9CFD6]">{activeStatus.messageFa}</p>
          </div>
        </div>
      ) : activeStatus?.status === 'offline' || activeStatus?.status === 'error' ? (
        <div
          data-testid="leaderboard-offline"
          className="rounded-xl bg-[#241B14] border border-[#6E4D2C] p-4 flex items-start gap-3"
        >
          <CloudOff className="w-5 h-5 text-[#F2BE4E] mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-xs sm:text-sm text-[#EED9B8] leading-relaxed">
            <p className="font-semibold text-[#FBF4E4]">
              سرور جدول امتیازات در دسترس نیست
            </p>
            <p className="mt-1 text-[#CBB896]">{activeStatus.messageFa}</p>
          </div>
        </div>
      ) : scope === 'global' && globalResult?.status === 'ok' ? (
        globalResult.data.entries.length === 0 ? (
          <div
            data-testid="leaderboard-empty"
            className="rounded-xl bg-[#17120E] border border-[#35291E] p-4 text-xs sm:text-sm text-[#B8A485] text-center"
          >
            هنوز هیچ بازیکنی در جدول امتیازات جهانی ثبت نشده است.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {globalResult.data.playerEntry && (
              <div className="rounded-xl bg-[#152529] border border-[#246672] px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm tabular-nums">
                <span className="text-[#9CD3DA]">
                  رتبه جهانی شما:{' '}
                  <strong className="text-[#F2BE4E]">
                    #{toPersianDigits(globalResult.data.playerEntry.rank)}
                  </strong>
                </span>
                <span className="font-bold text-[#6CECF5]">
                  {toPersianDigits(globalResult.data.playerEntry.totalScore)} امتیاز کل
                </span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table
                data-testid="global-leaderboard-table"
                className="w-full text-right text-xs sm:text-sm tabular-nums border-collapse"
              >
                <thead>
                  <tr className="border-b border-[#35291E] text-[#A89375] text-[11px] sm:text-xs">
                    <th className="py-2 px-2 font-medium">رتبه</th>
                    <th className="py-2 px-2 font-medium">بازیکن</th>
                    <th className="py-2 px-2 font-medium">مجموع امتیاز</th>
                    <th className="py-2 px-2 font-medium">بهترین رکورد</th>
                    <th className="py-2 px-2 font-medium">چالش‌ها</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C2219]">
                  {globalResult.data.entries.map((entry) => (
                    <tr key={entry.playerIdHash} className="text-[#F5ECD7]">
                      <td className="py-2.5 px-2 font-bold text-[#F2BE4E]">
                        {toPersianDigits(entry.rank)}
                      </td>
                      <td className="py-2.5 px-2 font-medium truncate max-w-[150px]">
                        {entry.displayLabel}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-[#6CECF5]">
                        {toPersianDigits(entry.totalScore)}
                      </td>
                      <td className="py-2.5 px-2">{toPersianDigits(entry.bestSingleScore)}</td>
                      <td className="py-2.5 px-2">{toPersianDigits(entry.challengesCompleted)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(offset > 0 || globalResult.data.hasMore) && (
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
                  مجموع بازیکنان: {toPersianDigits(globalResult.data.total)}
                </span>
                <button
                  type="button"
                  disabled={!globalResult.data.hasMore || loading}
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
            {result.data.playerBest && (
              <div className="rounded-xl bg-[#152529] border border-[#246672] px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm tabular-nums">
                <span className="text-[#9CD3DA]">
                  رتبه شما در این چالش:{' '}
                  <strong className="text-[#F2BE4E]">
                    #{toPersianDigits(result.data.playerBest.rank)}
                  </strong>
                </span>
                <span className="font-bold text-[#6CECF5]">
                  {toPersianDigits(result.data.playerBest.score)} امتیاز
                </span>
              </div>
            )}

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
