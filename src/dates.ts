import { addDays, format, startOfWeek } from 'date-fns';
import type { DateKey } from './types';

export const WEEK_STARTS_ON = 1; // Monday

export const toDateKey = (date: Date): DateKey => format(date, 'yyyy-MM-dd');

export const WEEKDAY_LABELS = Array.from({ length: 7 }, (_, index) =>
  format(
    addDays(startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON }), index),
    'EEE'
  )
);

/** `count` consecutive weeks, each as 7 days, starting from the week containing `from`. */
export const buildWeeks = (from: Date, count: number): Date[][] => {
  const firstDay = startOfWeek(from, { weekStartsOn: WEEK_STARTS_ON });
  return Array.from({ length: count }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addDays(firstDay, week * 7 + day))
  );
};

/** e.g. `Fri 26 September` — used as the modal heading. */
export const formatLongDate = (date: Date): string =>
  format(date, 'EEEE d MMMM yyyy');
