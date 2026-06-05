export const SCHEDULED_MIN_MINUTES = 13 * 60;
export const SCHEDULED_MAX_ONLINE_MINUTES = 20 * 60;

export type ScheduledTimeStatus =
  | 'idle'
  | 'invalid'
  | 'ok'
  | 'call_required'
  | 'out_of_range';

export type ParsedTime = { hours: number; minutes: number; totalMinutes: number };

const TIME_RE = /^(\d{1,2})[:.](\d{2})$/;
const TIME_COMPACT_RE = /^(\d{1,2})(\d{2})$/;

export function parsePreferredTime(raw: string): ParsedTime | null {
  const s = String(raw || '').trim();
  if (!s) return null;

  let hours: number;
  let minutes: number;
  const colonMatch = s.match(TIME_RE);
  if (colonMatch) {
    hours = Number(colonMatch[1]);
    minutes = Number(colonMatch[2]);
  } else {
    const compactMatch = s.match(TIME_COMPACT_RE);
    if (!compactMatch) return null;
    hours = Number(compactMatch[1]);
    minutes = Number(compactMatch[2]);
  }

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return { hours, minutes, totalMinutes: hours * 60 + minutes };
}

export type DayHours = { openMinutes: number; closeMinutes: number };

export function getHoursForDay(dayOfWeek: number): DayHours {
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return { openMinutes: 11 * 60, closeMinutes: 22 * 60 };
  }
  return { openMinutes: 12 * 60, closeMinutes: 21 * 60 };
}

export function getClosingMinutesForDay(dayOfWeek: number): number {
  return getHoursForDay(dayOfWeek).closeMinutes;
}

export function getOpeningMinutesForDay(dayOfWeek: number): number {
  return getHoursForDay(dayOfWeek).openMinutes;
}

export function getWarsawMinutesNow(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Warsaw',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return hour * 60 + minute;
}

export function isRestaurantOpen(now: Date = new Date()): boolean {
  const day = getWarsawDayOfWeek(now);
  const { openMinutes, closeMinutes } = getHoursForDay(day);
  const nowMinutes = getWarsawMinutesNow(now);
  return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
}

const WEEKDAY_PART: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

export function getWarsawDayOfWeek(now: Date = new Date()): number {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Warsaw',
    weekday: 'short'
  }).format(now);
  return WEEKDAY_PART[weekday] ?? 0;
}

export function getScheduledTimeStatus(
  preferredTime: string,
  now: Date = new Date()
): ScheduledTimeStatus {
  const trimmed = String(preferredTime || '').trim();
  if (!trimmed) return 'idle';

  const parsed = parsePreferredTime(trimmed);
  if (!parsed) return 'invalid';

  const { totalMinutes } = parsed;
  const closing = getClosingMinutesForDay(getWarsawDayOfWeek(now));

  if (totalMinutes < SCHEDULED_MIN_MINUTES || totalMinutes > closing) {
    return 'out_of_range';
  }
  if (totalMinutes > SCHEDULED_MAX_ONLINE_MINUTES) {
    return 'call_required';
  }
  return 'ok';
}
