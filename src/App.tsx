import { useEffect, useMemo, useState } from 'react';
import { startOfDay } from 'date-fns';
import styled from 'styled-components';
import AccountButton from './components/AccountButton';
import Calendar from './components/Calendar';
import EventList from './components/EventList';
import EventModal from './components/EventModal';
import ViewSwitch from './components/ViewSwitch';
import type { View } from './components/ViewSwitch';
import WeekdayRow from './components/WeekdayRow';
import { phone } from './breakpoints';
import { buildMonths, toDateKey } from './dates';
import { buildOccupancy } from './occupancy';
import { useAuth } from './useAuth';
import { useEvents } from './useEvents';
import { upcomingLabel } from './text';
import { createEvent } from './types';
import type { CalendarEvent } from './types';

/** Half a year per load, so scrolling reaches well past the next few weekends. */
const MONTHS_PER_LOAD = 6;
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
  const [monthCount, setMonthCount] = useState(MONTHS_PER_LOAD);
  const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);

  // Anchored once per mount so the grid does not shift while the app is open.
  const today = useMemo(() => startOfDay(new Date()), []);
  const months = useMemo(
    () => buildMonths(today, monthCount),
    [today, monthCount]
  );
  const occupancy = useMemo(() => buildOccupancy(events), [events]);

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
    // A later day of a multi-day event opens the event it belongs to.
    const existing = occupancy[key]?.event;
    // Signed out, an empty day has nothing to show.
    if (!existing && !canEdit) return;
    setOpenEvent(existing ?? createEvent(key));
  };

  const isExisting = Boolean(openEvent && events[openEvent.date]);

  return (
    <Page>
      <StickyTop>
        <Header>
          <Heading>
            <Title>Keikkaryhmä</Title>
            <Subtitle>
              {authError ? (
                <Problem>{authError}</Problem>
              ) : writeState === 'denied' ? (
                <Problem>
                  Ei tallennettu — tunnuksellasi ei ole muokkausoikeutta
                </Problem>
              ) : writeState === 'error' ? (
                <Problem>Ei tallennettu — tarkista verkkoyhteys</Problem>
              ) : syncState === 'loading' ? (
                'Ladataan…'
              ) : syncState === 'denied' ? (
                <Problem>
                  Firestoren säännöt eivät salli tämän kalenterin lukemista
                </Problem>
              ) : syncState === 'error' ? (
                <Problem>
                  Ei yhteyttä — näytetään viimeksi synkronoidut keikat
                </Problem>
              ) : upcoming.length > 0 ? (
                upcomingLabel(upcoming.length)
              ) : (
                'Ei tulevia keikkoja'
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
        {view === 'calendar' && <WeekdayRow />}
      </StickyTop>

      {view === 'list' ? (
        <EventList events={upcoming} onOpen={setOpenEvent} />
      ) : (
        <>
          <Calendar
            months={months}
            occupancy={occupancy}
            today={today}
            canEdit={canEdit}
            onOpenDay={openDay}
          />
          <Footer>
            <LoadMore
              type="button"
              onClick={() => setMonthCount((count) => count + MONTHS_PER_LOAD)}
            >
              Lataa puoli vuotta lisää
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
  /* No top padding: the sticky block carries it, so it stays above the title. */
  padding: 0 20px 48px;

  ${phone} {
    padding: 0 12px 36px;
  }
`;

/**
 * Keeps the controls and the weekday names in place while the months scroll past.
 * The opaque background is what hides the cells passing underneath, and the
 * z-index stays below the modal overlay.
 */
const StickyTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--bg);
  padding: 28px 0 10px;

  ${phone} {
    padding: 18px 0 8px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;

  ${phone} {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 10px;
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
