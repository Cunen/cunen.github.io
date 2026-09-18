import { isSameDay, isSameMonth } from 'date-fns';
import styled from 'styled-components';
import DayCell from './DayCell';
import { calendarColumns } from './calendarGrid';
import { phone } from '../breakpoints';
import { formatMonth, toDateKey } from '../dates';
import type { MonthGroup } from '../dates';
import type { OccupancyByDate } from '../occupancy';

type Props = {
  months: MonthGroup[];
  occupancy: OccupancyByDate;
  today: Date;
  canEdit: boolean;
  onOpenDay: (date: Date) => void;
};

const Calendar = ({ months, occupancy, today, canEdit, onOpenDay }: Props) => (
  <Months>
    {months.map((group) => (
      <Month key={group.key}>
        <MonthHeading>{formatMonth(group.month)}</MonthHeading>
        <Grid>
          {group.days.map((day) => (
            <DayCell
              key={toDateKey(day)}
              date={day}
              occupancy={occupancy[toDateKey(day)]}
              isToday={isSameDay(day, today)}
              isPast={day < today && !isSameDay(day, today)}
              isOutsideMonth={!isSameMonth(day, group.month)}
              canEdit={canEdit}
              onOpen={() => onOpenDay(day)}
            />
          ))}
        </Grid>
      </Month>
    ))}
  </Months>
);

const Months = styled.div`
  display: flex;
  flex-direction: column;
  gap: 34px;

  ${phone} {
    gap: 24px;
  }
`;

const Month = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MonthHeading = styled.h2`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Grid = styled.div`
  ${calendarColumns}
`;

export default Calendar;
