import { useMemo, useState } from 'react';
import { startOfDay } from 'date-fns';
import styled from 'styled-components';
import Calendar from './components/Calendar';
import EventModal from './components/EventModal';
import { buildWeeks, toDateKey } from './dates';
import { useEvents } from './useEvents';
import { createEvent } from './types';
import type { CalendarEvent } from './types';

const WEEKS_PER_PAGE = 8;

function App() {
  const { events, saveEvent, deleteEvent } = useEvents();
  const [weekCount, setWeekCount] = useState(WEEKS_PER_PAGE);
  const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);

  // Anchored once per mount so the grid does not shift while the app is open.
  const today = useMemo(() => startOfDay(new Date()), []);
  const weeks = useMemo(() => buildWeeks(today, weekCount), [today, weekCount]);

  const openDay = (date: Date) => {
    const key = toDateKey(date);
    setOpenEvent(events[key] ?? createEvent(key));
  };

  const isExisting = Boolean(openEvent && events[openEvent.date]);

  const upcoming = Object.values(events).filter(
    (event) => event.date >= toDateKey(today)
  ).length;

  return (
    <Page>
      <Header>
        <div>
          <Title>Calendar</Title>
          <Subtitle>
            {upcoming > 0
              ? `${upcoming} upcoming ${upcoming === 1 ? 'event' : 'events'}`
              : 'Pick a day to add an event'}
          </Subtitle>
        </div>
      </Header>

      <Calendar
        weeks={weeks}
        events={events}
        today={today}
        onOpenDay={openDay}
      />

      <Footer>
        <LoadMore
          type="button"
          onClick={() => setWeekCount((count) => count + WEEKS_PER_PAGE)}
        >
          Load {WEEKS_PER_PAGE} more weeks
        </LoadMore>
      </Footer>

      {openEvent && (
        <EventModal
          key={openEvent.date}
          event={openEvent}
          isExisting={isExisting}
          onSave={(event) => {
            saveEvent(event);
            // Creating from a draft keeps the modal open, now in edit mode.
            setOpenEvent(event);
          }}
          onDelete={() => {
            deleteEvent(openEvent.date);
            setOpenEvent(null);
          }}
          onClose={() => setOpenEvent(null)}
        />
      )}
    </Page>
  );
}

const Page = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 20px 48px;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const Subtitle = styled.p`
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--muted);
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 18px;
`;

const LoadMore = styled.button`
  border: 1px solid var(--line);
  border-radius: 999px;
  background: none;
  padding: 8px 18px;
  color: var(--muted);
  cursor: pointer;

  &:hover {
    border-color: var(--line-strong);
    color: var(--text);
  }
`;

export default App;
