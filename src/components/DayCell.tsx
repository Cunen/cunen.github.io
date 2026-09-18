import { format, getDate } from 'date-fns';
import styled from 'styled-components';
import type { CalendarEvent } from '../types';

type Props = {
  date: Date;
  event?: CalendarEvent;
  isToday: boolean;
  isPast: boolean;
  onOpen: () => void;
};

const DayCell = ({ date, event, isToday, isPast, onOpen }: Props) => {
  const dayNumber = getDate(date);

  return (
    <Cell
      type="button"
      onClick={onOpen}
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
          {(event.startTime || event.location) && (
            <Meta>
              {[event.startTime, event.location].filter(Boolean).join(' · ')}
            </Meta>
          )}
          {event.artists.length > 0 && (
            <Artists>{event.artists.join(', ')}</Artists>
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
        <AddHint aria-hidden="true">+</AddHint>
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

  &:hover {
    border-color: var(--line-strong);
    background: var(--surface);
  }
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DayNumber = styled.span<{ $today: boolean }>`
  font-size: 12px;
  font-weight: ${({ $today }) => ($today ? 700 : 500)};
  color: ${({ $today }) => ($today ? 'var(--accent)' : 'var(--muted)')};
`;

const MonthTag = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text);
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
`;

const Meta = styled.span`
  font-size: 12px;
  color: var(--muted);
  overflow-wrap: anywhere;
`;

const Artists = styled.span`
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
`;

export default DayCell;
