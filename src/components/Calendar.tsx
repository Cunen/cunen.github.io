import { Fragment } from 'react';
import { format, getISOWeek, isSameDay, isSameWeek } from 'date-fns';
import styled from 'styled-components';
import DayCell from './DayCell';
import { phone } from '../breakpoints';
import { WEEKDAY_LABELS, WEEK_STARTS_ON, toDateKey } from '../dates';
import type { EventsByDate } from '../types';

type Props = {
  weeks: Date[][];
  events: EventsByDate;
  today: Date;
  canEdit: boolean;
  onOpenDay: (date: Date) => void;
};

const Calendar = ({ weeks, events, today, canEdit, onOpenDay }: Props) => (
  <Grid>
    <WeekHeading aria-hidden="true" />
    {WEEKDAY_LABELS.map((label) => (
      <WeekdayHeading key={label}>
        <Full>{label}</Full>
        <Short>{label.charAt(0)}</Short>
      </WeekdayHeading>
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
              canEdit={canEdit}
              onOpen={() => onOpenDay(day)}
            />
          ))}
        </Fragment>
      );
    })}
  </Grid>
);

/** Eight columns — a week-number gutter plus one per weekday — so every week fills one row. */
const Grid = styled.div`
  display: grid;
  /* minmax(0, …) lets the columns shrink, so narrow tablets reflow instead of
     pushing a horizontal scrollbar onto the page. */
  grid-template-columns: 46px repeat(7, minmax(0, 1fr));
  gap: 6px;

  ${phone} {
    /* The gutter is dropped so seven days fit the viewport without side-scrolling. */
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 3px;
  }
`;

const WeekdayHeading = styled.div`
  padding: 0 8px 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);

  ${phone} {
    padding: 0 0 4px;
    text-align: center;
    letter-spacing: 0;
  }
`;

const Full = styled.span`
  ${phone} {
    display: none;
  }
`;

const Short = styled.span`
  display: none;

  ${phone} {
    display: inline;
  }
`;

const WeekHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 2px;
  padding: 8px 8px 0 0;

  ${phone} {
    display: none;
  }
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
