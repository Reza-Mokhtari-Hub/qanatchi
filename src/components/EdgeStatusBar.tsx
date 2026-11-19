import { useCallback, useEffect, useRef, useState } from 'react';
import { Cloud, CloudOff, RefreshCw, ShieldCheck } from 'lucide-react';
import { fetchApiHealth, type ApiHealthResult } from '../api/edgeClient';

interface EdgeStatusBarProps {
  compact?: boolean;
}

export function EdgeStatusBar({ compact = false }: EdgeStatusBarProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [health, setHealth] = useState<ApiHealthResult | null>(null);
  const mountedRef = useRef<boolean>(true);
  const requestSeqRef = useRef<number>(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadHealth = useCallback(async () => {
    const seq = ++requestSeqRef.current;
    setLoading(true);
    const result = await fetchApiHealth();
    if (!mountedRef.current || seq !== requestSeqRef.current) {
      return;
    }
    setHealth(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  const isOnline = health?.status === 'online';
  const storageReady = isOnline && health.data.storage.configured;

  return (
    <section
      aria-label="وضعیت اتصال به سرور لبه"
      data-testid="edge-health-bar"
      className={`rounded-2xl border bg-[#1A1510] ${
        isOnline ? 'border-[#255A65]' : 'border-[#4A3A2A]'
      } ${compact ? 'px-4 py-3' : 'p-4 sm:p-5'}`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2.5 min-w-0">
          {loading ? (
            <Cloud className="w-4 h-4 text-[#9AC0C7] mt-0.5 shrink-0" aria-hidden="true" />
          ) : isOnline ? (
            <ShieldCheck className="w-4 h-4 text-[#6CECF5] mt-0.5 shrink-0" aria-hidden="true" />
          ) : (
            <CloudOff className="w-4 h-4 text-[#E6BA5E] mt-0.5 shrink-0" aria-hidden="true" />
          )}

          <div className="text-xs sm:text-sm min-w-0">
            <p
              data-testid="edge-health-label"
              className={`font-semibold ${
                loading
                  ? 'text-[#D7C6AA]'
                  : isOnline
                    ? 'text-[#CBEFF2]'
                    : 'text-[#F2CA70]'
              }`}
            >
              {loading
                ? 'در حال بررسی وضعیت سرور لبه...'
                : isOnline
                  ? storageReady
                    ? 'سرور لبه آروان فعال · تأیید سرور و جدول جهانی متصل است'
                    : 'سرور لبه فعال · تأیید سرور آماده (حافظه جدول جهانی در انتظار پیکربندی)'
                  : 'حالت آفلاین · سرور لبه در دسترس نیست'}
            </p>
            {!loading && (
              <p className="text-[11px] sm:text-xs text-[#A89375] mt-0.5 leading-relaxed">
                {isOnline ? (
                  <>
                    نسخه رابط برنامه‌نویسی:{' '}
                    <span dir="ltr" className="inline-block font-mono text-[#C7D7DA]">
                      {health.data.apiVersion}
                    </span>{' '}
                    · تاریخ رسمی سرور (تهران):{' '}
                    <span dir="ltr" className="inline-block font-mono text-[#C7D7DA]">
                      {health.data.serverDateTehran}
                    </span>
                  </>
                ) : (
                  'تمام مراحل کمپین، معمای روزانه و رقابت دوستانه به صورت آفلاین روی دستگاه شما فعال هستند.'
                )}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          data-testid="btn-refresh-edge-health"
          onClick={() => void loadHealth()}
          disabled={loading}
          className="min-h-[40px] px-3 rounded-xl bg-[#261E16] hover:bg-[#32271D] disabled:opacity-50 border border-[#523F2D] text-[#E6BA5E] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 shrink-0 ${loading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          <span>بررسی مجدد</span>
        </button>
      </div>
    </section>
  );
}
