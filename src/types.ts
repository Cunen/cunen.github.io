/** A day is identified by its local calendar date, formatted as `yyyy-MM-dd`. */
export type DateKey = string;

export type Artist = {
  id: string;
  name: string;
  /** 24h `HH:mm` set time, or an empty string when it is not announced. */
  time: string;
  genre: string;
};

export type CalendarEvent = {
  id: string;
  /** The day this event starts on. At most one event starts on a given day. */
  date: DateKey;
  title: string;
  /** 24h `HH:mm`, or an empty string when the start time is not decided yet. */
  startTime: string;
  location: string;
  /** Free text so "20 €", "15 / 20 at the door" and "free" all work. */
  price: string;
  /** Free text; any URLs in it are surfaced as links. */
  description: string;
  /** How many calendar days the event covers, starting from `date`. 1 = one day. */
  days: number;
  soldOut: boolean;
  artists: Artist[];
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
  price: '',
  description: '',
  days: 1,
  soldOut: false,
  artists: [],
  interested: [],
  going: [],
});

/** Anything longer is almost certainly a mistake, and the grid gets unreadable. */
export const MAX_EVENT_DAYS = 5;

export const clampDays = (value: number): number =>
  Number.isFinite(value)
    ? Math.min(Math.max(Math.trunc(value), 1), MAX_EVENT_DAYS)
    : 1;

export const createArtist = (name: string, time = '', genre = ''): Artist => ({
  id: crypto.randomUUID(),
  name,
  time,
  genre,
});
