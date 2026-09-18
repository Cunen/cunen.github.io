import { useCallback, useEffect, useState } from 'react';
import { loadEvents, saveEvents } from './storage';
import type { CalendarEvent, DateKey, EventsByDate } from './types';

export const useEvents = () => {
  const [events, setEvents] = useState<EventsByDate>(loadEvents);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const saveEvent = useCallback((event: CalendarEvent) => {
    setEvents((current) => ({ ...current, [event.date]: event }));
  }, []);

  const deleteEvent = useCallback((date: DateKey) => {
    setEvents((current) => {
      if (!(date in current)) return current;
      const next = { ...current };
      delete next[date];
      return next;
    });
  }, []);

  return { events, saveEvent, deleteEvent };
};
