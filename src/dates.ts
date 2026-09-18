import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { fi } from 'date-fns/locale';
import type { DateKey } from './types';

export const WEEK_STARTS_ON = 1; // Maanantai

/**
 * Every date shown to the reader goes through here, so the Finnish locale is
 * applied in one place instead of at each call site.
 */
export const formatDate = (date: Date, pattern: string): string =>
  format(date, pattern, { locale: fi });

/** Document ids are data, not display, so they stay locale-independent. */
export const toDateKey = (date: Date): DateKey => format(date, 'yyyy-MM-dd');

export const WEEKDAY_LABELS = Array.from({ length: 7 }, (_, index) =>
  formatDate(
    addDays(startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON }), index),
    'EEEEEE'
  )
);

/** `yyyy-MM-dd` back to a local Date at midnight. */
export const fromDateKey = (key: DateKey): Date => new Date(`${key}T00:00:00`);

export const addDaysTo = (date: Date, amount: number): Date =>
  addDays(date, amount);

export type MonthGroup = {
  /** `yyyy-MM`, stable across renders. */
  key: string;
  /** The first day of the month, for formatting the heading. */
  month: Date;
  /**
   * Every day of the month, padded at both ends to whole weeks. The padding days
   * belong to the neighbouring months and are greyed in `DayCell`.
   */
  days: Date[];
};

const buildMonth = (month: Date): MonthGroup => ({
  key: format(month, 'yyyy-MM'),
  month,
  days: eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: WEEK_STARTS_ON }),
  }),
});

/** `count` whole months, starting with the one containing `from`. */
export const buildMonths = (from: Date, count: number): MonthGroup[] =>
  Array.from({ length: count }, (_, index) =>
    buildMonth(startOfMonth(addMonths(from, index)))
  );

/** esim. `syyskuu 2026` — standalone form, so `LLLL` rather than `MMMM`. */
export const formatMonth = (date: Date): string =>
  formatDate(date, 'LLLL yyyy');

/** esim. `lauantai 26. syyskuuta 2026` — modaalin otsikko. */
export const formatLongDate = (date: Date): string =>
  formatDate(date, 'EEEE d. MMMM yyyy');
