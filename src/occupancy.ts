import { addDaysTo, fromDateKey, toDateKey } from './dates';
import type { CalendarEvent, DateKey, EventsByDate } from './types';

export type DayOccupancy = {
  event: CalendarEvent;
  /** 0 on the day the event starts, 1 on its second day, and so on. */
  dayIndex: number;
};

export type OccupancyByDate = Record<DateKey, DayOccupancy>;

/**
 * Spreads multi-day events across the days they cover, so the calendar can show
 * every one of them. A day that an event *starts* on always keeps that event —
 * another event's later days never push it aside.
 */
export const buildOccupancy = (events: EventsByDate): OccupancyByDate => {
  const occupancy: OccupancyByDate = {};
  // Sorted so an overlap between two multi-day events resolves the same way
  // on every render.
  const byDate = Object.values(events).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  for (const event of byDate) {
    occupancy[event.date] = { event, dayIndex: 0 };
  }

  for (const event of byDate) {
    const start = fromDateKey(event.date);
    for (let dayIndex = 1; dayIndex < event.days; dayIndex++) {
      const key = toDateKey(addDaysTo(start, dayIndex));
      if (occupancy[key]?.dayIndex === 0) continue;
      occupancy[key] = { event, dayIndex };
    }
  }

  return occupancy;
};

/** The last day an event covers, for date ranges in the list and the modal. */
export const lastDayOf = (event: CalendarEvent): Date =>
  addDaysTo(fromDateKey(event.date), event.days - 1);
