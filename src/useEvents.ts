import { useCallback, useEffect, useState } from 'react';
import {
  removeEvent,
  stateForError,
  subscribeToEvents,
  writeEvent,
} from './eventRepository';
import type { SyncState } from './eventRepository';
import type { CalendarEvent, DateKey, EventsByDate } from './types';

/** `null` while every write so far has landed. */
export type WriteState = null | 'denied' | 'error';

export const useEvents = () => {
  const [events, setEvents] = useState<EventsByDate>({});
  const [syncState, setSyncState] = useState<SyncState>('loading');
  const [writeState, setWriteState] = useState<WriteState>(null);

  useEffect(() => subscribeToEvents(setEvents, setSyncState), []);

  // Firestore applies writes to the local cache first, so the snapshot listener
  // re-renders straight away and these never need optimistic state of their own.
  // A rejected write is rolled back and arrives as another (successful) snapshot,
  // which is why the failure is tracked here rather than on the subscription.
  const run = useCallback(async (action: Promise<void>, what: string) => {
    try {
      await action;
      setWriteState(null);
    } catch (error) {
      console.error(`[calendar] ${what} failed`, error);
      setWriteState(stateForError(error) === 'denied' ? 'denied' : 'error');
    }
  }, []);

  const saveEvent = useCallback(
    (event: CalendarEvent) => void run(writeEvent(event), 'saving the event'),
    [run]
  );

  const deleteEvent = useCallback(
    (date: DateKey) => void run(removeEvent(date), 'deleting the event'),
    [run]
  );

  return { events, syncState, writeState, saveEvent, deleteEvent };
};
