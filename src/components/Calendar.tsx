import { Fragment } from 'react';
import { format, getISOWeek, isSameDay, isSameWeek } from 'date-fns';
import styled from 'styled-components';
import DayCell from './DayCell';
import { WEEKDAY_LABELS, WEEK_STARTS_ON, toDateKey } from '../dates';
import type { EventsByDate } from '../types';

type Props = {
  weeks: Date[][];
  events: EventsByDate;
  today: Date;
  onOpenDay: (date: Date) => void;
};

const Calendar = ({ weeks, events, today, onOpenDay }: Props) => (
  <Scroller>
    <Grid>
      <WeekHeading aria-hidden="true" />
      {WEEKDAY_LABELS.map((label) => (
        <WeekdayHeading key={label}>{label}</WeekdayHeading>
      ))}

      {weeks.map((week) => {
        const isCurrentWeek = isSameWeek(week[0], today, {
          weekStartsOn: WEEK_STARTS_ON,
        });
        return (
          <Fragment key={toDateKey(week[0])}>
            <WeekHeading>
              <WeekNumber $current={isCurrentWeek}>
                w{getISOWeek(week[0])}
              </WeekNumber>
              <WeekMonth>{format(week[0], 'MMM')}</WeekMonth>
            </WeekHeading>
            {week.map((day) => (
              <DayCell
                key={toDateKey(day)}
                date={day}
                event={events[toDateKey(day)]}
                isToday={isSameDay(day, today)}
                isPast={day < today && !isSameDay(day, today)}
                onOpen={() => onOpenDay(day)}
              />
            ))}
          </Fragment>
        );
      })}
    </Grid>
  </Scroller>
);

const Scroller = styled.div`
  overflow-x: auto;
`;

/** Eight columns — a week-number gutter plus one per weekday — so every week fills one row. */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 46px repeat(7, minmax(112px, 1fr));
  gap: 6px;
  min-width: 720px;
`;

const WeekdayHeading = styled.div`
  padding: 0 8px 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
`;

const WeekHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 2px;
  padding: 8px 8px 0 0;
`;

const WeekNumber = styled.span<{ $current: boolean }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $current }) => ($current ? 'var(--accent)' : 'var(--muted)')};
`;

const WeekMonth = styled.span`
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
`;

export default Calendar;
