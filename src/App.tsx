import { useEffect, useMemo, useState } from 'react';
import { startOfDay } from 'date-fns';
import styled from 'styled-components';
import AccountButton from './components/AccountButton';
import Calendar from './components/Calendar';
import EventList from './components/EventList';
import EventModal from './components/EventModal';
import ViewSwitch from './components/ViewSwitch';
import type { View } from './components/ViewSwitch';
import { phone } from './breakpoints';
import { buildWeeks, toDateKey } from './dates';
import { useAuth } from './useAuth';
import { useEvents } from './useEvents';
import { createEvent } from './types';
import type { CalendarEvent } from './types';

const WEEKS_PER_PAGE = 8;
const VIEW_KEY = 'calendar.view';

const readStoredView = (): View => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'calendar' ? 'calendar' : 'list';
  } catch {
    return 'list';
  }
};

function App() {
  const {
    user,
    canEdit,
    resolved,
    error: authError,
    signIn,
    signOut,
  } = useAuth();
  const { events, syncState, writeState, saveEvent, deleteEvent } = useEvents();
  const [view, setView] = useState<View>(readStoredView);
  const [weekCount, setWeekCount] = useState(WEEKS_PER_PAGE);
  const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);

  // Anchored once per mount so the grid does not shift while the app is open.
  const today = useMemo(() => startOfDay(new Date()), []);
  const weeks = useMemo(() => buildWeeks(today, weekCount), [today, weekCount]);

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, view);
    } catch {
      // A remembered tab is a nicety; losing it does not matter.
    }
  }, [view]);

  const upcoming = useMemo(() => {
    const todayKey = toDateKey(today);
    return Object.values(events)
      .filter((event) => event.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, today]);

  const openDay = (date: Date) => {
    const key = toDateKey(date);
    const existing = events[key];
    // Signed out, an empty day has nothing to show.
    if (!existing && !canEdit) return;
    setOpenEvent(existing ?? createEvent(key));
  };

  const isExisting = Boolean(openEvent && events[openEvent.date]);

  return (
    <Page>
      <Header>
        <Heading>
          <Title>Calendar</Title>
          <Subtitle>
            {authError ? (
              <Problem>{authError}</Problem>
            ) : writeState === 'denied' ? (
              <Problem>Not saved — your account is not allowed to edit</Problem>
            ) : writeState === 'error' ? (
              <Problem>Not saved — check your connection</Problem>
            ) : syncState === 'loading' ? (
              'Loading…'
            ) : syncState === 'denied' ? (
              <Problem>
                The Firestore rules do not allow reading this calendar
              </Problem>
            ) : syncState === 'error' ? (
              <Problem>
                Offline — showing the last events synced to this device
              </Problem>
            ) : upcoming.length > 0 ? (
              `${upcoming.length} upcoming ${upcoming.length === 1 ? 'event' : 'events'}`
            ) : (
              'Nothing coming up yet'
            )}
          </Subtitle>
        </Heading>
        <Controls>
          <ViewSwitch view={view} onChange={setView} />
          <AccountButton
            user={user}
            resolved={resolved}
            onSignIn={() => void signIn()}
            onSignOut={signOut}
          />
        </Controls>
      </Header>

      {view === 'list' ? (
        <EventList events={upcoming} onOpen={setOpenEvent} />
      ) : (
        <>
          <Calendar
            weeks={weeks}
            events={events}
            today={today}
            canEdit={canEdit}
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
        </>
      )}

      {openEvent && (
        // Remounts on sign-in so the read view is replaced by the form in place.
        <EventModal
          key={`${openEvent.date}-${canEdit}`}
          event={openEvent}
          isExisting={isExisting}
          canEdit={canEdit}
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
          onSignIn={() => void signIn()}
        />
      )}
    </Page>
  );
}

const Page = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 20px 48px;

  ${phone} {
    padding: 18px 12px 36px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;

  ${phone} {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const Heading = styled.div`
  min-width: 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;

  ${phone} {
    width: 100%;
    justify-content: space-between;
  }
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

const Problem = styled.span`
  color: var(--interested);
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
