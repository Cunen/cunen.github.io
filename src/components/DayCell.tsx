import { getDate } from 'date-fns';
import styled from 'styled-components';
import { phone } from '../breakpoints';
import { formatDate } from '../dates';
import { UNTITLED, goingLabel, interestedLabel } from '../text';
import type { DayOccupancy } from '../occupancy';

type Props = {
  date: Date;
  occupancy?: DayOccupancy;
  isToday: boolean;
  isPast: boolean;
  /** True for the padding days that complete the first and last weeks. */
  isOutsideMonth: boolean;
  canEdit: boolean;
  onOpen: () => void;
};

const DayCell = ({
  date,
  occupancy,
  isToday,
  isPast,
  isOutsideMonth,
  canEdit,
  onOpen,
}: Props) => {
  const dayNumber = getDate(date);
  const event = occupancy?.event;
  const isStart = occupancy?.dayIndex === 0;
  const meta =
    event && isStart
      ? [event.startTime, event.location].filter(Boolean).join(' · ')
      : '';
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
      $soldOut={Boolean(event?.soldOut)}
      aria-label={
        event
          ? `${event.title || UNTITLED} ${formatDate(date, 'd. MMMM')}`
          : `Lisää keikka päivälle ${formatDate(date, 'd. MMMM')}`
      }
    >
      <DayHeader>
        <DayNumber $today={isToday} $outside={isOutsideMonth}>
          {dayNumber}
        </DayNumber>
        {event && event.days > 1 && (
          <DayCounter>
            {(occupancy?.dayIndex ?? 0) + 1}/{event.days}
          </DayCounter>
        )}
      </DayHeader>

      {event ? (
        <Event>
          <Title $continued={!isStart}>{event.title || UNTITLED}</Title>
          {meta && <Meta>{meta}</Meta>}
          {isStart && event.artists.length > 0 && (
            <Artists>
              {event.artists.map((artist) => artist.name).join(', ')}
            </Artists>
          )}
          <Badges>
            {event.soldOut && <SoldOut>Loppuunmyyty</SoldOut>}
            {isStart && event.going.length > 0 && (
              <Going>{goingLabel(event.going.length)}</Going>
            )}
            {isStart && event.interested.length > 0 && (
              <Interested>
                {interestedLabel(event.interested.length)}
              </Interested>
            )}
          </Badges>
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
  $soldOut: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 118px;
  padding: 8px;
  text-align: left;
  /* Sold out outranks today's outline: it is the thing you need to notice. */
  border: 1px solid
    ${({ $today, $soldOut }) =>
      $soldOut ? 'var(--danger)' : $today ? 'var(--accent)' : 'var(--line)'};
  border-radius: 10px;
  background: ${({ $hasEvent, $soldOut }) =>
    $soldOut
      ? 'var(--danger-soft)'
      : $hasEvent
        ? 'var(--surface)'
        : 'transparent'};
  opacity: ${({ $past, $hasEvent }) => ($past && !$hasEvent ? 0.45 : 1)};
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.12s ease,
    background 0.12s ease;

  &:hover:not(:disabled) {
    border-color: ${({ $soldOut }) =>
      $soldOut ? 'var(--danger)' : 'var(--line-strong)'};
    background: ${({ $soldOut }) =>
      $soldOut ? 'var(--danger-soft)' : 'var(--surface)'};
  }

  &:disabled {
    cursor: default;
  }

  ${phone} {
    gap: 3px;
    min-height: 58px;
    padding: 4px 3px;
    border-radius: 7px;
    background: ${({ $hasEvent, $soldOut }) =>
      $soldOut
        ? 'var(--danger-soft)'
        : $hasEvent
          ? 'var(--accent-soft)'
          : 'transparent'};
  }
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;

  ${phone} {
    gap: 3px;
  }
`;

const DayNumber = styled.span<{ $today: boolean; $outside: boolean }>`
  font-size: 12px;
  font-weight: ${({ $today }) => ($today ? 700 : 500)};
  color: ${({ $today }) => ($today ? 'var(--accent)' : 'var(--muted)')};
  opacity: ${({ $outside }) => ($outside ? 0.45 : 1)};

  ${phone} {
    font-size: 11px;
  }
`;

/** `2/3` on the second day of a three-day event. */
const DayCounter = styled.span`
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  color: var(--muted);

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

const Title = styled.span<{ $continued: boolean }>`
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  overflow-wrap: anywhere;
  /* Continuation days are quieter, so the day it starts reads as the anchor. */
  color: ${({ $continued }) => ($continued ? 'var(--muted)' : 'inherit')};

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

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
  font-size: 11px;

  &:empty {
    display: none;
  }

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

const SoldOut = styled(Badge)`
  background: var(--danger);
  color: var(--on-danger);
  font-weight: 600;
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
