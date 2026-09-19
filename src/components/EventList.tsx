import styled from 'styled-components';
import { phone } from '../breakpoints';
import { formatDate, fromDateKey } from '../dates';
import { lastDayOf } from '../occupancy';
import { UNTITLED, goingLabel, interestedLabel } from '../text';
import type { CalendarEvent } from '../types';

type Props = {
  events: CalendarEvent[];
  onOpen: (event: CalendarEvent) => void;
};

const EventList = ({ events, onOpen }: Props) => {
  if (events.length === 0) {
    return (
      <Empty>
        Ei tulevia keikkoja. Vaihda kalenterinäkymään, valitse päivä ja lisää
        ensimmäinen keikka.
      </Empty>
    );
  }

  return (
    <List>
      {events.map((event) => {
        const date = fromDateKey(event.date);
        const meta = [
          event.startTime,
          event.location,
          event.days > 1 ? `${event.days} päivää` : '',
        ]
          .filter(Boolean)
          .join(' · ');

        return (
          <Item
            key={event.date}
            type="button"
            onClick={() => onOpen(event)}
            $soldOut={event.soldOut}
          >
            <DateBlock>
              <Weekday>{formatDate(date, 'EEEEEE')}</Weekday>
              <DayNumber>
                {formatDate(date, 'd')}
                {event.days > 1 && (
                  <EndDay>&ndash;{formatDate(lastDayOf(event), 'd')}</EndDay>
                )}
              </DayNumber>
              <Month>{formatDate(date, 'MMM')}</Month>
            </DateBlock>

            <Details>
              <Title>{event.title || UNTITLED}</Title>
              {meta && <Meta>{meta}</Meta>}
              {event.artists.length > 0 && (
                <Artists>
                  {event.artists.map((artist) => artist.name).join(', ')}
                </Artists>
              )}
            </Details>

            <Counts>
              {event.soldOut && <SoldOut>Loppuunmyyty</SoldOut>}
              {event.going.length > 0 && (
                <Going>{goingLabel(event.going.length)}</Going>
              )}
              {event.interested.length > 0 && (
                <Interested>
                  {interestedLabel(event.interested.length)}
                </Interested>
              )}
            </Counts>
          </Item>
        );
      })}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.button<{ $soldOut: boolean }>`
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px 14px;
  text-align: left;
  border: 1px solid
    ${({ $soldOut }) => ($soldOut ? 'var(--danger)' : 'var(--line)')};
  border-radius: 12px;
  background: ${({ $soldOut }) =>
    $soldOut ? 'var(--danger-soft)' : 'var(--surface)'};
  cursor: pointer;
  transition:
    border-color 0.12s ease,
    transform 0.12s ease;

  &:hover {
    border-color: ${({ $soldOut }) =>
      $soldOut ? 'var(--danger)' : 'var(--line-strong)'};
  }

  ${phone} {
    grid-template-columns: 46px 1fr;
    grid-template-areas:
      'date details'
      'date counts';
    row-gap: 6px;
    column-gap: 12px;
    align-items: start;
  }
`;

const DateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.15;

  ${phone} {
    grid-area: date;
    align-items: flex-start;
  }
`;

const Weekday = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
`;

const DayNumber = styled.span`
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
`;

/** The closing day of a multi-day event, kept smaller so the start still leads. */
const EndDay = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
`;

const Month = styled.span`
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  ${phone} {
    grid-area: details;
  }
`;

const Title = styled.span`
  font-size: 15px;
  font-weight: 600;
  overflow-wrap: anywhere;
`;

const Meta = styled.span`
  font-size: 13px;
  color: var(--muted);
  overflow-wrap: anywhere;
`;

const Artists = styled.span`
  font-size: 13px;
  color: var(--accent);
  overflow-wrap: anywhere;
`;

const Counts = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
  font-size: 11px;

  ${phone} {
    grid-area: counts;
    justify-content: flex-start;
  }
`;

const Badge = styled.span`
  border-radius: 999px;
  padding: 2px 8px;
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

const Empty = styled.p`
  margin: 0;
  padding: 40px 16px;
  text-align: center;
  color: var(--muted);
`;

export default EventList;
