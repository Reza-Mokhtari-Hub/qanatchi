interface QanatchiLogoProps {
  compact?: boolean;
  animationsEnabled?: boolean;
}

/**
 * Custom inline SVG Persian geometric Shamsa crest & architectural QANATCHI title lockup.
 */
export function QanatchiLogo({
  compact = false,
  animationsEnabled = true,
}: QanatchiLogoProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2.5 shrink-0">
        <svg
          viewBox="0 0 48 48"
          className="w-9 h-9 shrink-0"
          aria-hidden="true"
        >
          <polygon
            points="24,3 39,9 45,24 39,39 24,45 9,39 3,24 9,9"
            fill="#102533"
            stroke="#E5B754"
            strokeWidth="2.2"
          />
          <polygon
            points="24,9 35,14 39,24 35,34 24,39 13,34 9,24 13,14"
            fill="none"
            stroke="#1CB4C6"
            strokeWidth="1.4"
            strokeOpacity="0.9"
          />
          <path
            d="M24 13 C24 13 32 22.5 32 28 C32 32.4 28.4 36 24 36 C19.6 36 16 32.4 16 28 C16 22.5 24 13 24 13 Z"
            fill="#1CB4C6"
          />
          <path
            d="M22 21 C20.5 24 19.5 26.5 19.5 28.3 C19.5 30.6 21.1 32.3 23 32.8"
            fill="none"
            stroke="#9EF7FF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-2xl tracking-normal text-[#FBF4E4] whitespace-nowrap">
          قنات‌چی
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center select-none">
      {/* Persian Octagonal Shamsa & Turquoise Qanat Crest */}
      <div className="relative mb-3">
        <svg
          viewBox="0 0 132 132"
          className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_14px_30px_rgba(0,0,0,0.65)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="qanatchiGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9D987" />
              <stop offset="50%" stopColor="#D99B26" />
              <stop offset="100%" stopColor="#946210" />
            </linearGradient>
            <linearGradient id="qanatchiLapis" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#163648" />
              <stop offset="100%" stopColor="#0C1D28" />
            </linearGradient>
            <linearGradient id="qanatchiWater" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#77F2FC" />
              <stop offset="52%" stopColor="#16B0C2" />
              <stop offset="100%" stopColor="#0A5C6B" />
            </linearGradient>
          </defs>

          {/* Subtle outer Persian filigree halo */}
          <circle
            cx="66"
            cy="66"
            r="60"
            fill="none"
            stroke="#D99B26"
            strokeWidth="0.9"
            strokeDasharray="2 5"
            strokeOpacity="0.45"
          />

          {/* Outer rotated squares forming an 8-point Persian Shamsa star */}
          <rect
            x="24"
            y="24"
            width="84"
            height="84"
            rx="7"
            fill="url(#qanatchiLapis)"
            stroke="url(#qanatchiGold)"
            strokeWidth="2.8"
          />
          <rect
            x="24"
            y="24"
            width="84"
            height="84"
            rx="7"
            transform="rotate(45 66 66)"
            fill="#0F2432"
            stroke="url(#qanatchiGold)"
            strokeWidth="2.8"
          />

          {/* Inner glazed turquoise tile medallion */}
          <circle
            cx="66"
            cy="66"
            r="38"
            fill="#0D1E2A"
            stroke="#1EB5C7"
            strokeWidth="2"
            strokeOpacity="0.9"
          />
          <circle
            cx="66"
            cy="66"
            r="32"
            fill="none"
            stroke="#F2C96B"
            strokeWidth="1.1"
            strokeDasharray="3 4"
            strokeOpacity="0.72"
          />

          {/* Subtle pointed Qanat vault arch framing the droplet */}
          <path
            d="M44 83 L44 63 Q66 36 88 63 L88 83"
            fill="none"
            stroke="#1EB5C7"
            strokeWidth="1.2"
            strokeOpacity="0.38"
          />

          {/* Luminous Persian Water Droplet */}
          <path
            d="M66 35 C66 35 84 57 84 70 C84 80 76 88 66 88 C56 88 48 80 48 70 C48 57 66 35 66 35 Z"
            fill="url(#qanatchiWater)"
            stroke="#B4FAFF"
            strokeWidth="1.6"
          />

          {/* Gentle ripple & specular sheen inside droplet */}
          <path
            d="M57 72 Q61.5 66.5 66 72 T75 72"
            fill="none"
            stroke="#F0FEFF"
            strokeWidth="2.3"
            strokeLinecap="round"
            className={animationsEnabled ? 'animate-water-shimmer' : ''}
          />
          <path
            d="M60.5 51 C57.5 56 55.5 61 55.5 65.5"
            fill="none"
            stroke="#D6FCFF"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeOpacity="0.88"
          />

          {/* 8 small brass star rivets on the Shamsa points */}
          <circle cx="66" cy="9" r="2.2" fill="#F2C96B" />
          <circle cx="66" cy="123" r="2.2" fill="#F2C96B" />
          <circle cx="9" cy="66" r="2.2" fill="#F2C96B" />
          <circle cx="123" cy="66" r="2.2" fill="#F2C96B" />
        </svg>
      </div>

      {/* Main Bilingual Architectural Title Lockup */}
      <h1 className="font-display text-5xl sm:text-6xl text-[#FBF4E4] tracking-normal leading-none drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
        قنات‌چی
      </h1>

      <p
        dir="ltr"
        className="mt-2 text-xs sm:text-sm font-semibold tracking-[0.32em] text-[#F2C96B] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
      >
        QANATCHI
      </p>

      {/* Persian Geometric Diamond Divider + Required Subtitle */}
      <div className="mt-3 flex items-center gap-3">
        <span className="h-px w-10 bg-gradient-to-l from-[#E8BD62]/80 to-transparent" aria-hidden="true" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#5BE8F5]" aria-hidden="true" />
        <p className="text-base sm:text-lg font-semibold text-[#D6F7FA] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
          نبض آب ایران
        </p>
        <span className="w-1.5 h-1.5 rotate-45 bg-[#5BE8F5]" aria-hidden="true" />
        <span className="h-px w-10 bg-gradient-to-r from-[#E8BD62]/80 to-transparent" aria-hidden="true" />
      </div>
    </div>
  );
}
