/** A day is identified by its local calendar date, formatted as `yyyy-MM-dd`. */
export type DateKey = string;

export type CalendarEvent = {
  id: string;
  /** The day this event occupies. At most one event exists per day. */
  date: DateKey;
  title: string;
  /** 24h `HH:mm`, or an empty string when the start time is not decided yet. */
  startTime: string;
  location: string;
  artists: string[];
  interested: string[];
  going: string[];
};

export type EventsByDate = Record<DateKey, CalendarEvent>;

export const createEvent = (date: DateKey): CalendarEvent => ({
  id: crypto.randomUUID(),
  date,
  title: '',
  startTime: '',
  location: '',
  artists: [],
  interested: [],
  going: [],
});
