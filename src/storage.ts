import type { CalendarEvent, EventsByDate } from './types';

const STORAGE_KEY = 'calendar.events.v1';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

/** Storage is user-editable and survives across versions, so validate before trusting it. */
const isCalendarEvent = (value: unknown): value is CalendarEvent => {
  if (typeof value !== 'object' || value === null) return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event.id === 'string' &&
    typeof event.date === 'string' &&
    typeof event.title === 'string' &&
    typeof event.startTime === 'string' &&
    typeof event.location === 'string' &&
    isStringArray(event.artists) &&
    isStringArray(event.interested) &&
    isStringArray(event.going)
  );
};

export const loadEvents = (): EventsByDate => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};

    const events: EventsByDate = {};
    for (const [date, event] of Object.entries(parsed)) {
      if (isCalendarEvent(event)) events[date] = event;
    }
    return events;
  } catch {
    return {};
  }
};

export const saveEvents = (events: EventsByDate): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Private mode or a full quota: keep the app usable, just unpersisted.
  }
};
