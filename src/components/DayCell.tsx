import { format, getDate } from 'date-fns';
import styled from 'styled-components';
import { phone } from '../breakpoints';
import type { CalendarEvent } from '../types';

type Props = {
  date: Date;
  event?: CalendarEvent;
  isToday: boolean;
  isPast: boolean;
  canEdit: boolean;
  onOpen: () => void;
};

const DayCell = ({ date, event, isToday, isPast, canEdit, onOpen }: Props) => {
  const dayNumber = getDate(date);
  const meta =
    event && [event.startTime, event.location].filter(Boolean).join(' · ');
  // An empty day only leads somewhere when it can be filled in.
  const interactive = Boolean(event) || canEdit;

  return (
    <Cell
      type="button"
      onClick={onOpen}
      disabled={!interactive}
      $today={isToday}
      $past={isPast}
      $hasEvent={Boolean(event)}
      aria-label={
        event
          ? `${event.title || 'Untitled event'} on ${format(date, 'd MMMM')}`
          : `Add an event on ${format(date, 'd MMMM')}`
      }
    >
      <DayHeader>
        <DayNumber $today={isToday}>{dayNumber}</DayNumber>
        {dayNumber === 1 && <MonthTag>{format(date, 'MMM')}</MonthTag>}
      </DayHeader>

      {event ? (
        <Event>
          <Title>{event.title || 'Untitled event'}</Title>
          {meta && <Meta>{meta}</Meta>}
          {event.artists.length > 0 && (
            <Artists>
              {event.artists.map((artist) => artist.name).join(', ')}
            </Artists>
          )}
          {(event.going.length > 0 || event.interested.length > 0) && (
            <Counts>
              {event.going.length > 0 && (
                <Going>{event.going.length} going</Going>
              )}
              {event.interested.length > 0 && (
                <Interested>{event.interested.length} interested</Interested>
              )}
            </Counts>
          )}
        </Event>
      ) : (
        canEdit && <AddHint aria-hidden="true">+</AddHint>
      )}
    </Cell>
  );
};

const Cell = styled.button<{
  $today: boolean;
  $past: boolean;
  $hasEvent: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 118px;
  padding: 8px;
  text-align: left;
  border: 1px solid
    ${({ $today }) => ($today ? 'var(--accent)' : 'var(--line)')};
  border-radius: 10px;
  background: ${({ $hasEvent }) =>
    $hasEvent ? 'var(--surface)' : 'transparent'};
  opacity: ${({ $past, $hasEvent }) => ($past && !$hasEvent ? 0.45 : 1)};
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.12s ease,
    background 0.12s ease;

  &:hover:not(:disabled) {
    border-color: var(--line-strong);
    background: var(--surface);
  }

  &:disabled {
    cursor: default;
  }

  ${phone} {
    gap: 3px;
    min-height: 58px;
    padding: 4px 3px;
    border-radius: 7px;
    background: ${({ $hasEvent }) =>
      $hasEvent ? 'var(--accent-soft)' : 'transparent'};
  }
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  ${phone} {
    gap: 3px;
  }
`;

const DayNumber = styled.span<{ $today: boolean }>`
  font-size: 12px;
  font-weight: ${({ $today }) => ($today ? 700 : 500)};
  color: ${({ $today }) => ($today ? 'var(--accent)' : 'var(--muted)')};

  ${phone} {
    font-size: 11px;
  }
`;

const MonthTag = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text);

  ${phone} {
    font-size: 9px;
  }
`;

const Event = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  overflow-wrap: anywhere;

  ${phone} {
    font-size: 10px;
    line-height: 1.2;
    /* Two lines is all a phone-width column can carry; the list view has the rest. */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

/** Everything below the title is desktop-only; phone cells only have room for a name. */
const Secondary = styled.span`
  ${phone} {
    display: none;
  }
`;

const Meta = styled(Secondary)`
  font-size: 12px;
  color: var(--muted);
  overflow-wrap: anywhere;
`;

const Artists = styled(Secondary)`
  font-size: 12px;
  color: var(--accent);
  overflow-wrap: anywhere;
`;

const Counts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
  font-size: 11px;

  ${phone} {
    display: none;
  }
`;

const Badge = styled.span`
  border-radius: 999px;
  padding: 1px 7px;
  white-space: nowrap;
`;

const Going = styled(Badge)`
  background: var(--going-soft);
  color: var(--going);
`;

const Interested = styled(Badge)`
  background: var(--interested-soft);
  color: var(--interested);
`;

const AddHint = styled.span`
  margin: auto auto 2px 2px;
  font-size: 18px;
  line-height: 1;
  color: var(--muted);
  opacity: 0;
  transition: opacity 0.12s ease;

  ${Cell}:hover & {
    opacity: 1;
  }

  ${phone} {
    display: none;
  }
`;

export default DayCell;
