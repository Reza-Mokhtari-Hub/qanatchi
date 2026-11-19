import { useState } from 'react';
import {
  Accessibility,
  ArrowRight,
  Check,
  Droplets,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { soundEngine } from '../audio/soundEffects';
import type { GameSettings } from '../engine/types';
import { EdgeStatusBar } from './EdgeStatusBar';

interface SettingsScreenProps {
  settings: GameSettings;
  systemPrefersReducedMotion: boolean;
  onUpdateSettings: (next: GameSettings) => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export function SettingsScreen({
  settings,
  systemPrefersReducedMotion,
  onUpdateSettings,
  onResetProgress,
  onBack,
}: SettingsScreenProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const toggleSetting = (key: keyof GameSettings) => {
    const nextValue = !settings[key];
    onUpdateSettings({
      ...settings,
      [key]: nextValue,
    });
    if (key === 'soundEnabled') {
      if (nextValue) {
        soundEngine.playHint(true);
      }
    } else {
      soundEngine.playButtonClick(settings.soundEnabled);
    }
  };

  const handleConfirmReset = () => {
    soundEngine.playButtonClick(settings.soundEnabled);
    onResetProgress();
    setConfirmReset(false);
    setResetDone(true);
  };

  const effectiveMotionActive = settings.animationsEnabled && !systemPrefersReducedMotion;

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-[#111922] via-[#15120F] to-[#120E0B] text-[#F5ECD7] flex flex-col">
      <header className="w-full border-b border-[#463524] bg-[#17130F]/95">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              soundEngine.playButtonClick(settings.soundEnabled);
              onBack();
            }}
            aria-label="بازگشت به صفحه اصلی"
            className="min-h-[44px] px-3 rounded-xl text-[#F2C96B] hover:bg-[#271F17] flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B] whitespace-nowrap"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>بازگشت</span>
          </button>

          <h1 className="font-display text-xl sm:text-2xl text-[#FBF4E4]">تنظیمات</h1>

          <div className="w-16" aria-hidden="true" />
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
        {/* Preferences Section */}
        <section
          aria-labelledby="settings-prefs-heading"
          className="divide-y divide-[#33271D] rounded-2xl bg-[#1B1611] border border-[#4D3B28] shadow-[0_12px_32px_rgba(0,0,0,0.38)]"
        >
          <div className="px-4 sm:px-5 py-3.5 bg-[#16232C]/65 rounded-t-2xl border-b border-[#33271D]">
            <h2
              id="settings-prefs-heading"
              className="text-xs sm:text-sm font-bold text-[#9FE8F0]"
            >
              صدا، انیمیشن و دسترسی‌پذیری
            </h2>
          </div>

          {/* Sound Effects Toggle */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#132934] border border-[#246876]/60 flex items-center justify-center shrink-0">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#5BE8F5]" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-5 h-5 text-[#988369]" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base text-[#FBF4E4]">
                  جلوه‌های صوتی
                </p>
                <p className="text-xs sm:text-sm text-[#C3AF90] mt-0.5 leading-relaxed">
                  صدای چرخش سنگ، جریان آب، ستاره‌ها و پیروزی (آفلاین بدون فایل خارجی)
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              data-testid="setting-sound-toggle"
              aria-checked={settings.soundEnabled}
              aria-label="تغییر وضعیت جلوه‌های صوتی"
              onClick={() => toggleSetting('soundEnabled')}
              className={`min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B] ${
                settings.soundEnabled
                  ? 'bg-[#126C7A] border-[#3CC6D6]/70 text-[#F2FEFF] hover:bg-[#168191]'
                  : 'bg-[#282019] border-[#4E3D2D] text-[#C6B397] hover:bg-[#342A20]'
              }`}
            >
              {settings.soundEnabled ? (
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <X className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>{settings.soundEnabled ? 'روشن' : 'خاموش'}</span>
            </button>
          </div>

          {/* Smooth Animations Toggle */}
          <div className="p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#271F15] border border-[#6E5332]/65 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#F2C96B]" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-[#FBF4E4]">
                    انیمیشن‌های روان
                  </p>
                  <p className="text-xs sm:text-sm text-[#C3AF90] mt-0.5 leading-relaxed">
                    حرکت پلکانی جریان آب در لوله‌ها، چرخش نرم کاشی‌ها و جلوه پیروزی
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                data-testid="setting-animations-toggle"
                aria-checked={settings.animationsEnabled}
                aria-label="تغییر وضعیت انیمیشن‌های روان"
                onClick={() => toggleSetting('animationsEnabled')}
                className={`min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B] ${
                  settings.animationsEnabled
                    ? 'bg-[#126C7A] border-[#3CC6D6]/70 text-[#F2FEFF] hover:bg-[#168191]'
                    : 'bg-[#282019] border-[#4E3D2D] text-[#C6B397] hover:bg-[#342A20]'
                }`}
              >
                {settings.animationsEnabled ? (
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                ) : (
                  <X className="w-4 h-4 shrink-0" aria-hidden="true" />
                )}
                <span>{settings.animationsEnabled ? 'روشن' : 'کاهش‌یافته'}</span>
              </button>
            </div>

            {systemPrefersReducedMotion && (
              <div
                data-testid="system-reduced-motion-notice"
                className="rounded-xl bg-[#132630] border border-[#296373] px-3.5 py-2.5 flex items-start gap-2 text-xs text-[#BCEFF5] leading-relaxed"
              >
                <Accessibility className="w-4 h-4 text-[#69F0FB] mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  تنظیم کاهش حرکت سیستم‌عامل شما فعال است؛ بازی به صورت خودکار انیمیشن‌های تزئینی را کاهش داده است ({effectiveMotionActive ? 'فعال' : 'کاهش‌یافته'}).
                </span>
              </div>
            )}
          </div>

          {/* Leak Indicators Toggle */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#132934] border border-[#246876]/60 flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5 text-[#69F0FB]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base text-[#FBF4E4]">
                  نمایش نقاط نشت آب
                </p>
                <p className="text-xs sm:text-sm text-[#C3AF90] mt-0.5 leading-relaxed">
                  نمایش علامت هشدار و قطرات نشت در دهانه‌های باز هنگام آزمایش مسیر
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              data-testid="setting-leaks-toggle"
              aria-checked={settings.showLeakHints}
              aria-label="تغییر وضعیت نمایش نقاط نشت آب"
              onClick={() => toggleSetting('showLeakHints')}
              className={`min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B] ${
                settings.showLeakHints
                  ? 'bg-[#126C7A] border-[#3CC6D6]/70 text-[#F2FEFF] hover:bg-[#168191]'
                  : 'bg-[#282019] border-[#4E3D2D] text-[#C6B397] hover:bg-[#342A20]'
              }`}
            >
              {settings.showLeakHints ? (
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <X className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>{settings.showLeakHints ? 'فعال' : 'غیرفعال'}</span>
            </button>
          </div>
        </section>

        {/* Local Data Management */}
        <section className="rounded-2xl bg-[#1B1611] border border-[#4D3B28] p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-semibold text-sm sm:text-base text-[#FBF4E4]">
                حافظه محلی پیشرفت
              </h2>
              <p className="text-xs sm:text-sm text-[#C3AF90] mt-1">
                تمام ستاره‌ها و رکوردهای شما به صورت آفلاین در مرورگر ذخیره می‌شوند.
              </p>
            </div>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playButtonClick(settings.soundEnabled);
                  setResetDone(false);
                  setConfirmReset(true);
                }}
                className="min-h-[44px] px-4 rounded-xl border border-[#8E3B3B] text-[#F2A6A6] hover:bg-[#3A1B1B] text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A6A6]"
              >
                <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>بازنشانی پیشرفت</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="min-h-[44px] px-4 rounded-xl bg-[#B83232] hover:bg-[#CF3B3B] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCA5A5]"
                >
                  تأیید پاک‌سازی
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="min-h-[44px] px-4 rounded-xl bg-[#2E241C] hover:bg-[#3B2E24] text-[#E6D6BC] text-sm font-medium transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C96B]"
                >
                  انصراف
                </button>
              </div>
            )}
          </div>

          {resetDone && (
            <p role="status" className="mt-3 text-xs sm:text-sm text-[#6BE6F0]">
              پیشرفت مراحل و امتیازهای ذخیره شده با موفقیت پاک شد.
            </p>
          )}
        </section>

        {/* Live Edge API Connectivity Status */}
        <EdgeStatusBar />
      </main>
    </div>
  );
}
