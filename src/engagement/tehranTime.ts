import { toPersianDigits } from '../engine/scoring';

export const TEHRAN_TIMEZONE = 'Asia/Tehran';

const DATE_KEY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

export interface TehranDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/**
 * Safely extract Gregorian date & wall-clock time components in Asia/Tehran timezone,
 * completely independent of the visitor's local system timezone.
 */
export function getTehranDateParts(date: Date = new Date()): TehranDateParts {
  const safeDate = Number.isFinite(date.getTime()) ? date : new Date(0);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TEHRAN_TIMEZONE,
    calendar: 'gregory',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(safeDate);
  const lookup = (type: Intl.DateTimeFormatPartTypes): number => {
    const found = parts.find((p) => p.type === type)?.value ?? '0';
    return Number.parseInt(found, 10) || 0;
  };

  const hour = lookup('hour');
  return {
    year: lookup('year'),
    month: lookup('month'),
    day: lookup('day'),
    hour: hour === 24 ? 0 : hour,
    minute: lookup('minute'),
    second: lookup('second'),
  };
}

/**
 * Return the canonical Tehran calendar date key ("YYYY-MM-DD").
 */
export function getTehranDateKey(date: Date = new Date()): string {
  const p = getTehranDateParts(date);
  const y = String(p.year).padStart(4, '0');
  const m = String(p.month).padStart(2, '0');
  const d = String(p.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Strictly validate a "YYYY-MM-DD" calendar date key (rejects invalid dates like 2026-02-30).
 */
export function isValidDateKey(dateKey: string): boolean {
  const match = DATE_KEY_REGEX.exec(dateKey);
  if (!match) return false;
  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  if (year < 2000 || year > 2150 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const check = new Date(Date.UTC(year, month - 1, day));
  return (
    check.getUTCFullYear() === year &&
    check.getUTCMonth() === month - 1 &&
    check.getUTCDate() === day
  );
}

/**
 * Convert a valid "YYYY-MM-DD" date key into a UTC noon Date so formatting in Asia/Tehran
 * always lands squarely on the exact calendar day regardless of DST or offset edges.
 */
export function dateKeyToTehranNoonDate(dateKey: string): Date | null {
  if (!isValidDateKey(dateKey)) return null;
  const [y, m, d] = dateKey.split('-').map((n) => Number.parseInt(n, 10));
  // 08:30 UTC is 12:00 Asia/Tehran (UTC+03:30)
  return new Date(Date.UTC(y, m - 1, d, 8, 30, 0));
}

/**
 * Exact signed calendar-day difference: (laterKey - earlierKey) in days.
 * Returns null if either key is malformed.
 */
export function diffTehranDateKeys(earlierKey: string, laterKey: string): number | null {
  if (!isValidDateKey(earlierKey) || !isValidDateKey(laterKey)) {
    return null;
  }
  const [y1, m1, d1] = earlierKey.split('-').map((n) => Number.parseInt(n, 10));
  const [y2, m2, d2] = laterKey.split('-').map((n) => Number.parseInt(n, 10));
  const ms1 = Date.UTC(y1, m1 - 1, d1);
  const ms2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((ms2 - ms1) / 86_400_000);
}

/**
 * Shift a valid "YYYY-MM-DD" date key by an integer number of days.
 */
export function shiftDateKey(dateKey: string, deltaDays: number): string | null {
  if (!isValidDateKey(dateKey) || !Number.isInteger(deltaDays)) {
    return null;
  }
  const [y, m, d] = dateKey.split('-').map((n) => Number.parseInt(n, 10));
  const shifted = new Date(Date.UTC(y, m - 1, d + deltaDays));
  const sy = String(shifted.getUTCFullYear()).padStart(4, '0');
  const sm = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const sd = String(shifted.getUTCDate()).padStart(2, '0');
  return `${sy}-${sm}-${sd}`;
}

/**
 * Format a Tehran date key or Date in natural Persian Jalali calendar.
 * Example: "پنجشنبه ۲۸ آبان ۱۴۰۵"
 */
export function formatPersianJalaliDate(input: string | Date): string {
  const dateObj =
    typeof input === 'string'
      ? dateKeyToTehranNoonDate(input)
      : Number.isFinite(input.getTime())
        ? input
        : null;

  if (!dateObj) {
    return '';
  }

  try {
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      timeZone: TEHRAN_TIMEZONE,
      calendar: 'persian',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(dateObj);
    const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
    const day = parts.find((p) => p.type === 'day')?.value ?? '';
    const month = parts.find((p) => p.type === 'month')?.value ?? '';
    const year = parts.find((p) => p.type === 'year')?.value ?? '';
    if (weekday && day && month && year) {
      return toPersianDigits(`${weekday}، ${day} ${month} ${year}`);
    }
    return toPersianDigits(formatter.format(dateObj));
  } catch {
    return typeof input === 'string' ? toPersianDigits(input) : toPersianDigits(getTehranDateKey(dateObj));
  }
}

/**
 * Compute remaining milliseconds until midnight (00:00:00) of the next calendar day
 * in Asia/Tehran timezone.
 */
export function getMsUntilNextTehranDay(now: Date = new Date()): number {
  const safeNow = Number.isFinite(now.getTime()) ? now : new Date();
  const p = getTehranDateParts(safeNow);
  const elapsedInDayMs =
    ((p.hour * 3600 + p.minute * 60 + p.second) * 1000) + safeNow.getUTCMilliseconds();
  const remaining = 86_400_000 - elapsedInDayMs;
  return Math.max(0, Math.min(86_400_000, remaining));
}

/**
 * Format remaining milliseconds as HH:MM:SS in Persian numerals.
 */
export function formatCountdownPersian(remainingMs: number): string {
  const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const raw = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  return toPersianDigits(raw);
}
