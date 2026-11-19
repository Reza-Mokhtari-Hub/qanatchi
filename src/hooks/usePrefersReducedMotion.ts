import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function readSystemReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

/**
 * Pure helper combining the user's in-game animation setting with the OS/browser
 * prefers-reduced-motion accessibility preference.
 */
export function resolveEffectiveAnimationsEnabled(
  animationsEnabledSetting: boolean,
  systemPrefersReducedMotion: boolean,
): boolean {
  return Boolean(animationsEnabledSetting) && !Boolean(systemPrefersReducedMotion);
}

/**
 * Subscribes cleanly to OS/browser `prefers-reduced-motion: reduce` media query changes.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() =>
    readSystemReducedMotion(),
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setPrefersReduced(mediaQuery.matches);
    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }
    // Legacy Safari fallback
    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return prefersReduced;
}
