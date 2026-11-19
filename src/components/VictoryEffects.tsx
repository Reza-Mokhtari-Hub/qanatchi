import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { toPersianDigits } from '../engine/scoring';

interface AnimatedScoreCounterProps {
  value: number;
  animationsEnabled: boolean;
  className?: string;
  testId?: string;
}

/**
 * Smoothly counts up displayed score digits in Persian numerals without altering
 * the underlying computed score. Renders final value immediately when reduced motion is active.
 */
export function AnimatedScoreCounter({
  value,
  animationsEnabled,
  className,
  testId,
}: AnimatedScoreCounterProps) {
  const [displayed, setDisplayed] = useState<number>(() =>
    animationsEnabled ? 0 : value,
  );

  useEffect(() => {
    if (!animationsEnabled || value <= 0) {
      setDisplayed(value);
      return;
    }

    let rafId = 0;
    const durationMs = 680;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      // Ease-out cubic settling curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(value * eased));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [animationsEnabled, value]);

  return (
    <span data-testid={testId} className={className}>
      {toPersianDigits(displayed)}
    </span>
  );
}

interface AnimatedStarRowProps {
  stars: number;
  animationsEnabled: boolean;
  size?: 'md' | 'lg';
}

export function AnimatedStarRow({
  stars,
  animationsEnabled,
  size = 'lg',
}: AnimatedStarRowProps) {
  const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-9 h-9';

  return (
    <div
      className="flex items-center justify-center gap-3.5"
      aria-label={`${toPersianDigits(stars)} ستاره از ۳`}
    >
      {[1, 2, 3].map((idx) => {
        const earned = idx <= stars;
        const delayMs = idx * 130;
        return (
          <div key={idx} className="relative flex items-center justify-center">
            {earned && animationsEnabled && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[-6px] rounded-full border border-[#F2C96B]/60 animate-star-ring"
                style={{ animationDelay: `${delayMs}ms` }}
              />
            )}
            <Star
              className={`${iconSize} ${
                earned
                  ? `text-[#F2C96B] fill-[#F2BE4E] drop-shadow-[0_0_12px_rgba(242,190,78,0.45)] ${
                      animationsEnabled ? 'animate-star-pop' : ''
                    }`
                  : 'text-[#364950] fill-[#1E2B30]/60'
              }`}
              style={
                earned && animationsEnabled
                  ? { animationDelay: `${delayMs}ms` }
                  : undefined
              }
              aria-hidden="true"
            />
          </div>
        );
      })}
    </div>
  );
}

// 12 lightweight, fixed Persian geometric burst motes (zero JS loop, pure CSS compositor transform/opacity)
const CELEBRATION_MOTES: ReadonlyArray<{
  id: number;
  tx: string;
  ty: string;
  rot: string;
  color: string;
  delay: string;
  size: number;
}> = [
  { id: 1, tx: '-74px', ty: '-64px', rot: '45deg', color: '#F2C96B', delay: '20ms', size: 7 },
  { id: 2, tx: '72px', ty: '-60px', rot: '-35deg', color: '#5BE8F5', delay: '40ms', size: 7 },
  { id: 3, tx: '-96px', ty: '-18px', rot: '70deg', color: '#7DF8C4', delay: '70ms', size: 6 },
  { id: 4, tx: '96px', ty: '-22px', rot: '-65deg', color: '#F2C96B', delay: '50ms', size: 6 },
  { id: 5, tx: '-52px', ty: '-88px', rot: '25deg', color: '#5BE8F5', delay: '90ms', size: 6 },
  { id: 6, tx: '50px', ty: '-90px', rot: '-20deg', color: '#7DF8C4', delay: '80ms', size: 6 },
  { id: 7, tx: '-88px', ty: '28px', rot: '50deg', color: '#E6BA5E', delay: '100ms', size: 5 },
  { id: 8, tx: '88px', ty: '24px', rot: '-55deg', color: '#19B5C7', delay: '110ms', size: 5 },
  { id: 9, tx: '-24px', ty: '-98px', rot: '45deg', color: '#FBF4E4', delay: '60ms', size: 5 },
  { id: 10, tx: '26px', ty: '-96px', rot: '-45deg', color: '#F2C96B', delay: '75ms', size: 5 },
  { id: 11, tx: '-64px', ty: '52px', rot: '30deg', color: '#5BE8F5', delay: '120ms', size: 5 },
  { id: 12, tx: '64px', ty: '48px', rot: '-30deg', color: '#F2C96B', delay: '125ms', size: 5 },
];

interface VictoryCelebrationOrnamentProps {
  animationsEnabled: boolean;
}

/**
 * Subtle Persian turquoise water-ripple medallion + one-shot diamond burst
 * placed at the crown of the victory modal. Zero infinite particle loops.
 */
export function VictoryCelebrationOrnament({
  animationsEnabled,
}: VictoryCelebrationOrnamentProps) {
  return (
    <div
      className="relative mx-auto w-16 h-16 flex items-center justify-center mb-3"
      aria-hidden="true"
    >
      {/* Expanding water ripple waves */}
      {animationsEnabled && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#39DCEB]/60 animate-victory-ripple" />
          <span
            className="pointer-events-none absolute inset-0 rounded-full border border-[#F2C96B]/55 animate-victory-ripple"
            style={{ animationDelay: '240ms' }}
          />
        </>
      )}

      {/* One-shot delicate Persian diamond motes */}
      {animationsEnabled &&
        CELEBRATION_MOTES.map((m) => (
          <span
            key={m.id}
            className="pointer-events-none absolute rounded-[1px] animate-victory-mote"
            style={
              {
                width: `${m.size}px`,
                height: `${m.size}px`,
                backgroundColor: m.color,
                animationDelay: m.delay,
                '--mote-tx': m.tx,
                '--mote-ty': m.ty,
                '--mote-rot': m.rot,
              } as React.CSSProperties
            }
          />
        ))}

      {/* Central Persian Turquoise & Gold Oasis Seal */}
      <svg viewBox="0 0 64 64" className="relative z-10 w-16 h-16 drop-shadow-[0_6px_16px_rgba(20,184,201,0.38)]">
        <polygon
          points="32,3 52,12 61,32 52,52 32,61 12,52 3,32 12,12"
          fill="#0F2D37"
          stroke="#E8BD62"
          strokeWidth="2.4"
        />
        <circle cx="32" cy="32" r="20" fill="#126E7D" stroke="#69F0FB" strokeWidth="1.5" />
        <path
          d="M32 18 C32 18 42 29.5 42 36 C42 41.5 37.5 46 32 46 C26.5 46 22 41.5 22 36 C22 29.5 32 18 32 18 Z"
          fill="#4BE6F3"
        />
        <path
          d="M27.5 36.5 Q30 33.5 32 36.5 T36.5 36.5"
          fill="none"
          stroke="#F4FEFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
