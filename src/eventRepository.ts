import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { EVENTS_COLLECTION, db } from './firebase';
import { clampDays, createArtist } from './types';
import type { Artist, CalendarEvent, DateKey, EventsByDate } from './types';

const asString = (value: unknown): string =>
  typeof value === 'string' ? value : '';

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

/**
 * Documents are written by other clients and by earlier versions of this app,
 * so every field is normalised on the way in. Artists used to be plain strings.
 */
const asArtists = (value: unknown): Artist[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item): Artist[] => {
    if (typeof item === 'string') return item ? [createArtist(item)] : [];
    if (typeof item !== 'object' || item === null) return [];
    const artist = item as Record<string, unknown>;
    return [
      {
        id: asString(artist.id) || crypto.randomUUID(),
        name: asString(artist.name),
        time: asString(artist.time),
        genre: asString(artist.genre),
      },
    ];
  });
};

const toEvent = (id: string, data: Record<string, unknown>): CalendarEvent => ({
  id: asString(data.id) || id,
  date: asString(data.date) || id,
  title: asString(data.title),
  startTime: asString(data.startTime),
  location: asString(data.location),
  price: asString(data.price),
  description: asString(data.description),
  days: typeof data.days === 'number' ? clampDays(data.days) : 1,
  soldOut: data.soldOut === true,
  artists: asArtists(data.artists),
  interested: asStringArray(data.interested),
  going: asStringArray(data.going),
});

/** `denied` means the Firestore rules rejected the request, which is not an outage. */
export type SyncState = 'loading' | 'ready' | 'denied' | 'error';

export const stateForError = (error: unknown): SyncState =>
  typeof error === 'object' &&
  error !== null &&
  (error as { code?: string }).code === 'permission-denied'
    ? 'denied'
    : 'error';

/**
 * Live subscription to the whole collection. Firestore replays its local cache
 * first, so the calendar renders immediately and then reconciles with the server.
 */
export const subscribeToEvents = (
  onEvents: (events: EventsByDate) => void,
  onState: (state: SyncState) => void
) =>
  onSnapshot(
    collection(db, EVENTS_COLLECTION),
    (snapshot) => {
      const events: EventsByDate = {};
      snapshot.forEach((document) => {
        const event = toEvent(document.id, document.data());
        events[event.date] = event;
      });
      onEvents(events);
      onState('ready');
    },
    (error) => {
      console.error('[calendar] events subscription failed', error);
      onState(stateForError(error));
    }
  );

export const writeEvent = (event: CalendarEvent) =>
  setDoc(doc(db, EVENTS_COLLECTION, event.date), event);

export const removeEvent = (date: DateKey) =>
  deleteDoc(doc(db, EVENTS_COLLECTION, date));
