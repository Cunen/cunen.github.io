import { format } from 'date-fns';
import styled from 'styled-components';
import { phone } from '../breakpoints';
import type { CalendarEvent } from '../types';

type Props = {
  events: CalendarEvent[];
  onOpen: (event: CalendarEvent) => void;
};

const EventList = ({ events, onOpen }: Props) => {
  if (events.length === 0) {
    return (
      <Empty>
        Nothing coming up yet. Switch to the calendar to pick a day and add the
        first event.
      </Empty>
    );
  }

  return (
    <List>
      {events.map((event) => {
        const date = new Date(`${event.date}T00:00:00`);
        const meta = [event.startTime, event.location, event.price]
          .filter(Boolean)
          .join(' · ');

        return (
          <Item key={event.date} type="button" onClick={() => onOpen(event)}>
            <DateBlock>
              <Weekday>{format(date, 'EEE')}</Weekday>
              <DayNumber>{format(date, 'd')}</DayNumber>
              <Month>{format(date, 'MMM')}</Month>
            </DateBlock>

            <Details>
              <Title>{event.title || 'Untitled event'}</Title>
              {meta && <Meta>{meta}</Meta>}
              {event.artists.length > 0 && (
                <Artists>
                  {event.artists.map((artist) => artist.name).join(', ')}
                </Artists>
              )}
            </Details>

            <Counts>
              {event.going.length > 0 && (
                <Going>{event.going.length} going</Going>
              )}
              {event.interested.length > 0 && (
                <Interested>{event.interested.length} interested</Interested>
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

const Item = styled.button`
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px 14px;
  text-align: left;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
  cursor: pointer;
  transition:
    border-color 0.12s ease,
    transform 0.12s ease;

  &:hover {
    border-color: var(--line-strong);
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

const Empty = styled.p`
  margin: 0;
  padding: 40px 16px;
  text-align: center;
  color: var(--muted);
`;

export default EventList;
